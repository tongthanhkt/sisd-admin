import { NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import path from 'path';
import sharp from 'sharp';
import { optimize as optimizeSvg } from 'svgo';
import { withCORS } from '@/lib/cors';

// Khởi tạo Google Cloud Storage
const storage = new Storage({
  keyFilename: path.join(process.cwd(), 'sisd-key.json'),
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
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
    const fileName = `${Date.now()}-${file.name}`;
    const mimeType = file.type;

    console.log('📥 File received:', fileName);
    console.log('📸 MIME type:', mimeType);
    console.log('📦 Original size:', buffer.length, 'bytes');

    let optimizedBuffer: Buffer;

    // 🔧 Nén tùy theo loại ảnh
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
      optimizedBuffer = await sharp(buffer)
        .webp({ quality: 75 })

        .toBuffer();
      console.log('🧪 Compressed WebP size:', optimizedBuffer.length, 'bytes');

    } else if (mimeType === 'image/svg+xml') {
      const optimizedSvg = optimizeSvg(buffer.toString(), {
        multipass: true,
        plugins: ['preset-default']
      });
      optimizedBuffer = Buffer.from(optimizedSvg.data);
      console.log('🧪 Optimized SVG size:', optimizedBuffer.length, 'bytes');

    } else {
      console.log('⚠️ Unsupported or non-image file. Skipping optimization.');
      optimizedBuffer = buffer;
    }

    // 📤 Upload lên GCS
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
