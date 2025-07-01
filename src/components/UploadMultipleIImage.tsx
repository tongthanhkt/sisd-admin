'use client';

import { IconUpload, IconX } from '@tabler/icons-react';
import Image from 'next/image';
import * as React from 'react';
import Dropzone, { type DropzoneProps } from 'react-dropzone';

import { useUploadFileMixed } from '@/hooks/use-upload-file';
import { useControllableState } from '@/hooks/use-controllable-state';
import { cn, formatBytes, isFile, isUrl } from '@/lib/utils';
import { FormLabel, FormMessage } from './ui/form';

interface UploadMultipleImageWithCaption {
  file: File | string;
  caption: string;
}

interface UploadMultipleImagePropsBase
  extends React.HTMLAttributes<HTMLDivElement> {
  onUpload?: (files: (File | string)[]) => Promise<void>;
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
}

interface UploadMultipleImagePropsWithCaption
  extends UploadMultipleImagePropsBase {
  withCaption: true;
  value?: UploadMultipleImageWithCaption[];
  onValueChange?: React.Dispatch<
    React.SetStateAction<UploadMultipleImageWithCaption[]>
  >;
}

interface UploadMultipleImagePropsWithoutCaption
  extends UploadMultipleImagePropsBase {
  withCaption?: false;
  value?: (File | string)[];
  onValueChange?: React.Dispatch<React.SetStateAction<(File | string)[]>>;
}

type UploadMultipleImageProps =
  | UploadMultipleImagePropsWithCaption
  | UploadMultipleImagePropsWithoutCaption;

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
    withCaption,
    ...rest
  } = props;

  // Always call both hooks
  const [filesWithCaption, setFilesWithCaption] = useControllableState<
    UploadMultipleImageWithCaption[]
  >({
    prop: (withCaption ? valueProp : undefined) as
      | UploadMultipleImageWithCaption[]
      | undefined,
    onChange: (withCaption ? onValueChange : undefined) as
      | React.Dispatch<React.SetStateAction<UploadMultipleImageWithCaption[]>>
      | undefined,
    defaultProp: []
  });
  const [filesNoCaption, setFilesNoCaption] = useControllableState<
    (File | string)[]
  >({
    prop: (!withCaption ? valueProp : undefined) as
      | (File | string)[]
      | undefined,
    onChange: (!withCaption ? onValueChange : undefined) as
      | React.Dispatch<React.SetStateAction<(File | string)[]>>
      | undefined,
    defaultProp: []
  });

  // Select correct state and setter
  const files = withCaption ? filesWithCaption : filesNoCaption;
  const setFiles = withCaption ? setFilesWithCaption : setFilesNoCaption;

  // Helper to get the files array for dropzone
  const filesForDropzone = withCaption
    ? (files as UploadMultipleImageWithCaption[]).map((f) => f.file)
    : (files as (File | string)[]);

  // Drop handler
  const { onDrop, handleRemove, canAddMore } = useUploadFileMixed({
    value: filesForDropzone,
    onValueChange: (newFiles) => {
      if (withCaption) {
        const newValue = (newFiles as (File | string)[]).map((file, idx) => {
          const old = (files as UploadMultipleImageWithCaption[]).find((f) =>
            isFile(f.file) && isFile(file)
              ? f.file.name === file.name
              : f.file === file
          );
          return { file, caption: old?.caption || '' };
        });
        (
          setFiles as React.Dispatch<
            React.SetStateAction<UploadMultipleImageWithCaption[]>
          >
        )(newValue);
      } else {
        (setFiles as React.Dispatch<React.SetStateAction<(File | string)[]>>)(
          newFiles as (File | string)[]
        );
      }
    },
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

  // Remove handler
  const handleRemoveImage = (idx: number) => {
    if (withCaption) {
      const arr = [...((files as UploadMultipleImageWithCaption[]) ?? [])];
      arr.splice(idx, 1);
      setFiles(arr as any);
    } else {
      handleRemove(idx);
    }
  };

  // Caption change handler
  const handleCaptionChange = (idx: number, caption: string) => {
    if (withCaption) {
      const arr = [...((files as UploadMultipleImageWithCaption[]) ?? [])];
      arr[idx] = { ...arr[idx], caption };
      setFiles(arr as any);
    }
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
            {filesForDropzone &&
              filesForDropzone.map((file, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'group relative flex h-28 items-center justify-center overflow-hidden rounded-lg bg-gray-100',
                    cardClassName
                  )}
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
                      value={
                        (files as UploadMultipleImageWithCaption[])?.[idx]
                          ?.caption || ''
                      }
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
