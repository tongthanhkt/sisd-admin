import { NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import path from 'path';

// Initialize Google Cloud Storage
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
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;

    // Upload to Google Cloud Storage
    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(fileName);

    await blob.save(buffer, {
      metadata: {
        contentType: file.type
      }
    });

    // Make the file publicly accessible
    await blob.makePublic();

    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

    return NextResponse.json({
      url: publicUrl,
      fileName: fileName
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
