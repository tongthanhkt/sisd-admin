export async function uploadFile(
  file: File
): Promise<{ url: string; fileName: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
    {
      method: 'POST',
      body: formData,
      headers: {
        description: 'SIS_OPS'
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }

  return response.json();
}

export async function uploadVideo(
  file: File
): Promise<{ url: string; fileName: string; id: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/upload/video`,
    {
      method: 'POST',
      body: formData,
      headers: {
        description: 'SIS_OPS'
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to upload video');
  }

  return response.json();
}
