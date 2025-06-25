import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFilesChange?: (files: File[]) => void;
  className?: string;
  maxFiles?: number;
  maxSize?: number;
  multiple?: boolean;
  isUploading?: boolean;
}

export function FileUploader({
  onFilesChange,
  className,
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024, // 5MB
  multiple = false,
  isUploading = false
}: FileUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Limit number of files
      const filesToUpload = acceptedFiles.slice(0, maxFiles);
      onFilesChange?.(filesToUpload);
    },
    [maxFiles, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles,
    maxSize,
    multiple,
    noClick: false,
    noDrag: false,
    noKeyboard: false
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors',
        isDragActive
          ? 'border-primary bg-primary/10'
          : 'border-muted-foreground/25',
        isUploading && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <input {...getInputProps()} disabled={isUploading} />
      {isUploading ? (
        <p className='text-muted-foreground text-sm'>Uploading...</p>
      ) : isDragActive ? (
        <p className='text-muted-foreground text-sm'>Drop the files here...</p>
      ) : (
        <p className='text-muted-foreground text-sm'>
          Drag & drop files here, or click to select files
        </p>
      )}
    </div>
  );
}
