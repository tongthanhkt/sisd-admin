export async function uploadFile(
  file: File
): Promise<{ url: string; fileName: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }

  return response.json();
}
