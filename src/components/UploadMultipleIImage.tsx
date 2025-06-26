import { IconX, IconUpload } from '@tabler/icons-react';
import Image from 'next/image';
import * as React from 'react';
import Dropzone, { type FileRejection } from 'react-dropzone';
import { cn } from '@/lib/utils';

export const UploadMultipleIImage = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const maxFiles = 6;

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      );
      const updatedFiles = [...files, ...newFiles].slice(0, maxFiles);
      setFiles(updatedFiles);
    },
    [files, maxFiles]
  );

  const handleRemove = (idx: number) => {
    setFiles((prev) => {
      const newArr = prev.filter((_, i) => i !== idx);
      if ('preview' in prev[idx])
        URL.revokeObjectURL((prev[idx] as any).preview);
      return newArr;
    });
  };

  return (
    <div>
      <div className='mb-2 flex items-center justify-between'>
        <span className='font-medium'>Others Images</span>
      </div>
      <Dropzone
        onDrop={onDrop}
        accept={{ 'image/*': [] }}
        maxFiles={maxFiles}
        multiple
        disabled={files.length >= maxFiles}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            className={cn(
              'grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            )}
          >
            {/* Upload box */}
            {files.length < maxFiles && (
              <div
                {...getRootProps()}
                className={cn(
                  'relative flex h-28 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition hover:bg-gray-50',
                  isDragActive && 'border-blue-400'
                )}
              >
                <input {...getInputProps({ multiple: true })} />
                <IconUpload className='mb-1 size-7 text-gray-400' />
                <span className='text-center text-xs text-gray-500'>
                  Drag & Drop your files here
                  <br />
                  Or Browse
                </span>
              </div>
            )}
            {/* Images */}
            {files.map((file, idx) => (
              <div
                key={idx}
                className='group relative flex h-28 items-center justify-center overflow-hidden rounded-lg bg-gray-100'
              >
                <Image
                  src={(file as any).preview}
                  alt={file.name}
                  fill
                  className='object-cover'
                  style={{ maxHeight: '100%', maxWidth: '100%' }}
                />
                <button
                  type='button'
                  onClick={() => handleRemove(idx)}
                  className='absolute top-1 right-1 rounded-full bg-white/80 p-1 opacity-0 transition group-hover:opacity-100'
                  title='Delete'
                >
                  <IconX className='size-4 text-red-500' />
                </button>
              </div>
            ))}
          </div>
        )}
      </Dropzone>
    </div>
  );
};
