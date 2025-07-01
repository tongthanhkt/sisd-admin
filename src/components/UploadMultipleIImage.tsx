'use client';

import { IconUpload, IconX } from '@tabler/icons-react';
import Image from 'next/image';
import * as React from 'react';
import Dropzone, { type DropzoneProps } from 'react-dropzone';

import { useUploadFileMixed } from '@/hooks/use-upload-file';
import { useControllableState } from '@/hooks/use-controllable-state';
import { cn, formatBytes, isFile, isUrl } from '@/lib/utils';
import { FormLabel, FormMessage } from './ui/form';

interface UploadMultipleImageProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: (File | string)[];
  onValueChange?: React.Dispatch<React.SetStateAction<(File | string)[]>>;
  onUpload?: (files: (File | string)[]) => Promise<void>;
  accept?: DropzoneProps['accept'];
  maxSize?: DropzoneProps['maxSize'];
  maxFiles?: number;
  multiple?: boolean;
  label?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
}

export const UploadMultipleIImage = (props: UploadMultipleImageProps) => {
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    accept = { 'image/*': [] },
    maxSize = 1024 * 1024 * 5, // 2MB
    maxFiles = 10,
    multiple = true,
    label = 'Others Images',
    disabled = false,
    className,
    error,
    helperText,
    ...rest
  } = props;

  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange
  });

  const { onDrop, handleRemove, canAddMore } = useUploadFileMixed({
    value: files,
    onValueChange: setFiles as React.Dispatch<
      React.SetStateAction<(File | string)[]>
    >,
    maxFiles,
    maxSize,
    onUpload,
    mode: 'multiple'
  });

  // Get preview URL for display
  const getPreviewUrl = (item: File | string): string => {
    if (isFile(item)) {
      return isFileWithPreview(item) ? item.preview : URL.createObjectURL(item);
    } else if (isUrl(item)) {
      return item;
    }
    return '';
  };

  return (
    <div className={cn('flex flex-col gap-2', className)} {...rest}>
      <FormLabel className={cn(error && 'text-destructive')}>
        {label}
        <span className='text-destructive'>*</span>
      </FormLabel>
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        maxSize={maxSize}
        maxFiles={maxFiles}
        multiple={multiple}
        disabled={disabled || !canAddMore}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            className={cn(
              'grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            )}
          >
            {/* Upload box */}
            {canAddMore && (
              <div
                {...getRootProps()}
                className={cn(
                  'relative flex h-28 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition hover:bg-gray-50',
                  isDragActive && 'border-blue-400',
                  disabled && 'cursor-not-allowed opacity-50'
                )}
              >
                <input {...getInputProps({ multiple: true })} />
                <IconUpload className='mb-1 size-7 text-gray-400' />
                <span className='text-center text-xs text-gray-500'>
                  Drag & Drop your files here
                  <br />
                  Or Browse
                </span>
                {maxSize && (
                  <span className='mt-1 text-center text-xs text-gray-400'>
                    Max {formatBytes(maxSize)} per file
                  </span>
                )}
              </div>
            )}
            {/* Images */}
            {files &&
              files.map((file, idx) => (
                <div
                  key={idx}
                  className='group relative flex h-28 items-center justify-center overflow-hidden rounded-lg bg-gray-100'
                >
                  <Image
                    src={getPreviewUrl(file)}
                    alt={isFile(file) ? file.name : `Image ${idx + 1}`}
                    fill
                    className='object-cover'
                    style={{ maxHeight: '100%', maxWidth: '100%' }}
                  />
                  <button
                    type='button'
                    onClick={() => handleRemove(idx)}
                    className='absolute top-1 right-1 rounded-full bg-white/80 p-1 opacity-0 transition group-hover:opacity-100'
                    title='Delete'
                    disabled={disabled}
                  >
                    <IconX className='size-4 text-red-500' />
                  </button>
                </div>
              ))}
          </div>
        )}
      </Dropzone>
      {helperText && (
        <FormMessage className={cn(error && 'text-destructive')}>
          {helperText}
        </FormMessage>
      )}
    </div>
  );
};

function isFileWithPreview(file: File): file is File & { preview: string } {
  return 'preview' in file && typeof file.preview === 'string';
}
