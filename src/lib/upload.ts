export async function uploadFile(
  file: File
): Promise<{ url: string; fileName: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      'description': 'OPS_UPLOAD'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }

  return response.json();
}
