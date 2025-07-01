import { NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import path from 'path';
import sharp from 'sharp';
import { optimize as optimizeSvg } from 'svgo';

// Khởi tạo Google Cloud Storage
const storage = new Storage({
  keyFilename: path.join(process.cwd(), 'sisd-key.json'),
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME || '';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const mimeType = file.type;

    let optimizedBuffer: Buffer;

    // 🔧 Tối ưu hóa ảnh
    if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
      optimizedBuffer = await sharp(buffer).jpeg({ quality: 80 }).toBuffer();
    } else if (mimeType === 'image/png') {
      optimizedBuffer = await sharp(buffer).png({ compressionLevel: 9 }).toBuffer();
    } else if (mimeType === 'image/webp') {
      optimizedBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
    } else if (mimeType === 'image/svg+xml') {
      const optimizedSvg = optimizeSvg(buffer.toString(), {
        multipass: true,
        plugins: ['preset-default'],
      });
      optimizedBuffer = Buffer.from(optimizedSvg.data);
    } else {
      // Các file khác: giữ nguyên
      optimizedBuffer = buffer;
    }

    // 📤 Upload lên Google Cloud Storage
    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(fileName);

    await blob.save(optimizedBuffer, {
      metadata: {
        contentType: mimeType,
      },
    });

    await blob.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

    return NextResponse.json({
      url: publicUrl,
      fileName,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
