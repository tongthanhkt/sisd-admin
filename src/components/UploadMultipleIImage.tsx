'use client';

import { IconUpload, IconX } from '@tabler/icons-react';
import Image from 'next/image';
import * as React from 'react';
import Dropzone, { type DropzoneProps } from 'react-dropzone';

import { useUploadFileMixed } from '@/hooks/use-upload-file';
import { cn, formatBytes, isFile, isUrl } from '@/lib/utils';
import { IUploadMultipleImageItem } from '@/types';
import { FormLabel, FormMessage } from './ui/form';

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15);
}

interface UploadMultipleImageProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onUpload?: (files: IUploadMultipleImageItem[]) => Promise<void>;
  accept?: DropzoneProps['accept'];
  maxSize?: DropzoneProps['maxSize'];
  maxFiles?: number;
  multiple?: boolean;
  label?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  cardClassName?: string;
  listClassName?: string;
  value?: IUploadMultipleImageItem[];
  onValueChange?: React.Dispatch<
    React.SetStateAction<IUploadMultipleImageItem[]>
  >;
  withCaption?: boolean;
}

export const UploadMultipleIImage = (props: UploadMultipleImageProps) => {
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    accept = { 'image/*': [] },
    maxSize = 1024 * 1024 * 2, // 2MB
    maxFiles = 6,
    multiple = true,
    label = 'Others Images',
    disabled = false,
    className,
    error,
    helperText,
    cardClassName,
    listClassName,
    withCaption = false,
    ...rest
  } = props;

  const files = valueProp ?? [];
  const setFiles = onValueChange ?? (() => {});

  // Helper to get the files array for dropzone
  const filesForDropzone = (files ?? []).map((f) => f.file);

  // Drop handler
  const { onDrop, handleRemove, canAddMore } = useUploadFileMixed({
    value: filesForDropzone,
    onValueChange: (newFiles) => {
      // Preserve id for existing files, assign new id for new files
      const newValue = (newFiles as (File | string)[]).map((file, idx) => {
        const old = (files ?? []).find((f) =>
          isFile(f.file) && isFile(file)
            ? (f.file as File).name === (file as File).name &&
              (f.file as File).size === (file as File).size &&
              (f.file as File).lastModified === (file as File).lastModified
            : f.file === file
        );
        return {
          file,
          caption: old?.caption || '',
          id: old?.id || generateId()
        };
      });
      setFiles(newValue);
    },
    maxFiles,
    maxSize,
    onUpload: onUpload
      ? (arr) =>
          onUpload(
            arr.map((file, idx) => ({
              file,
              caption: (files ?? [])[idx]?.caption || '',
              id: (files ?? [])[idx]?.id || generateId()
            }))
          )
      : undefined,
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

  // Remove handler
  const handleRemoveImage = (idx: number) => {
    const arr = [...(files ?? [])];
    arr.splice(idx, 1);
    setFiles(arr);
  };

  // Caption change handler
  const handleCaptionChange = (idx: number, caption: string) => {
    const arr = [...(files ?? [])];
    arr[idx] = { ...arr[idx], caption };
    setFiles(arr);
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
              'grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
              listClassName
            )}
          >
            {/* Upload box */}
            {canAddMore && (
              <div
                {...getRootProps()}
                className={cn(
                  'relative flex h-28 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition hover:bg-gray-50',
                  isDragActive && 'border-blue-400',
                  disabled && 'cursor-not-allowed opacity-50',
                  cardClassName
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
            {files.map((item, idx) => (
              <div
                key={item.id || idx}
                className={cn(
                  'group relative flex h-28 items-center justify-center overflow-hidden rounded-lg bg-gray-100',
                  cardClassName
                )}
              >
                <Image
                  src={getPreviewUrl(item.file)}
                  alt={
                    isFile(item.file)
                      ? (item.file as File).name
                      : `Image ${idx + 1}`
                  }
                  fill
                  className='object-cover'
                  style={{ maxHeight: '100%', maxWidth: '100%' }}
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(idx)}
                  className='absolute top-1 right-1 rounded-full bg-white/80 p-1 opacity-0 transition group-hover:opacity-100'
                  title='Delete'
                  disabled={disabled}
                >
                  <IconX className='size-4 text-red-500' />
                </button>
                {/* Caption input */}
                {withCaption && (
                  <input
                    type='text'
                    className='absolute right-1 bottom-1 left-1 rounded border border-gray-300 bg-white/80 px-2 py-1 text-xs outline-none'
                    placeholder='Enter caption...'
                    value={item.caption || ''}
                    onChange={(e) => handleCaptionChange(idx, e.target.value)}
                    disabled={disabled}
                  />
                )}
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
