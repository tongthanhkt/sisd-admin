import { NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import path from 'path';
import sharp from 'sharp';
import { withCORS } from '@/lib/cors';
import { optimize as optimizeSvg } from 'svgo';
// Khởi tạo Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME || '';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.log('❌ No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let fileName = `${Date.now()}-${file.name}`;
    let mimeType = file.type; // dùng let để có thể thay đổi

    console.log('📥 File received:', fileName);
    console.log('📸 MIME type:', mimeType);
    console.log('📦 Original size:', buffer.length, 'bytes');

    let optimizedBuffer: Buffer;

    if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
      optimizedBuffer = await sharp(buffer)
        .jpeg({ quality: 75, mozjpeg: true })
        .toBuffer();
      console.log('🧪 Compressed JPEG size:', optimizedBuffer.length, 'bytes');
    } else if (mimeType === 'image/png') {
      optimizedBuffer = await sharp(buffer)
        .png({ compressionLevel: 9, palette: true })
        .toBuffer();
      console.log('🧪 Compressed PNG size:', optimizedBuffer.length, 'bytes');
    } else if (mimeType === 'image/webp') {
      optimizedBuffer = await sharp(buffer).webp({ quality: 75 }).toBuffer();
      console.log('🧪 Compressed WebP size:', optimizedBuffer.length, 'bytes');
    } else if (mimeType === 'image/svg+xml') {
      try {
        const optimizedResult = optimizeSvg(buffer.toString(), {
          multipass: true,
          plugins: [
            'preset-default',
            'removeDimensions', // Loại bỏ width/height nhưng giữ viewBox
            'cleanupAttrs', // Làm sạch attribute
            'removeComments',
            'removeMetadata',
            'removeTitle',
            'removeDesc',
            'removeUselessDefs',
            'convertStyleToAttrs' // Gộp style vào attributes
          ]
        });

        optimizedBuffer = Buffer.from(optimizedResult.data);
        console.log('🧪 Optimized SVG size:', optimizedBuffer.length, 'bytes');
      } catch (err) {
        console.warn('❌ SVG optimization failed, using original:', err);
        optimizedBuffer = buffer;
      }
    } else {
      console.log('⚠️ Unsupported or non-image file. Skipping optimization.');
      optimizedBuffer = buffer;
    }

    // Upload file lên GCS với mimeType mới (nếu có đổi)
    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(fileName);

    await blob.save(optimizedBuffer, {
      metadata: {
        contentType: mimeType
      }
    });

    await blob.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

    console.log('✅ Upload successful:', publicUrl);

    const res = NextResponse.json({
      url: publicUrl,
      fileName,
      originalSize: buffer.length,
      compressedSize: optimizedBuffer.length,
      type: mimeType
    });

    return withCORS(res);
  } catch (error) {
    console.error('❌ Error uploading file:', error);
    const res = NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
    return withCORS(res);
  }
}

export function OPTIONS() {
  return withCORS(NextResponse.json({}));
}
