'use client';

import { IconUpload } from '@tabler/icons-react';
import Image from 'next/image';
import * as React from 'react';
import Dropzone, { type DropzoneProps } from 'react-dropzone';

import { useControllableState } from '@/hooks/use-controllable-state';
import { useUploadFileMixed } from '@/hooks/use-upload-file';
import { cn, formatBytes, isFile, isUrl } from '@/lib/utils';
import { Pencil } from 'lucide-react';
import { FormLabel } from './ui/form';

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: (File | string)[];
  onValueChange?: React.Dispatch<React.SetStateAction<(File | string)[]>>;
  onUpload?: (files: (File | string)[]) => Promise<void>;
  accept?: DropzoneProps['accept'];
  maxSize?: DropzoneProps['maxSize'];
  maxFiles?: DropzoneProps['maxFiles'];
  label?: string;
  required?: boolean;
}

export function UploadImage(props: FileUploaderProps) {
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    accept = { 'image/*': [] },
    maxSize = 1024 * 1024 * 2,
    maxFiles = 1,
    className,
    label = 'Thumbnail',
    required = false
  } = props;

  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange
  });

  const { onDrop, handleRemove } = useUploadFileMixed({
    value: files,
    onValueChange: setFiles as React.Dispatch<
      React.SetStateAction<(File | string)[]>
    >,
    maxFiles,
    maxSize,
    onUpload,
    mode: 'single'
  });

  // Helper to trigger file input click
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

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
    <div className='flex flex-col gap-2'>
      <FormLabel>
        {label} {required && <span className='text-destructive'>*</span>}
      </FormLabel>
      <div className='relative flex flex-col gap-6 overflow-hidden'>
        <Dropzone
          onDrop={onDrop}
          accept={accept}
          maxSize={maxSize}
          maxFiles={maxFiles}
          multiple={false}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={cn(
                'group border-muted-foreground/25 hover:bg-muted/25 relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed px-5 py-2.5 text-center transition',
                'ring-offset-background focus-visible:ring-ring focus-visible:outline-hiddenc focus-visible:ring-2 focus-visible:ring-offset-2',
                isDragActive && 'border-muted-foreground/50',
                className
              )}
              style={{ overflow: 'hidden' }}
              onClick={handleEditClick}
            >
              {/* Hidden input for re-upload */}
              <input
                {...getInputProps({ refKey: 'ref' })}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
              {files && files.length > 0 ? (
                <div className='relative flex h-full w-full items-center justify-center'>
                  <Image
                    src={getPreviewUrl(files[0])}
                    alt={isFile(files[0]) ? files[0].name : 'Thumbnail'}
                    fill
                    className='z-0 rounded-md object-contain'
                    style={{ maxHeight: '100%', maxWidth: '100%' }}
                  />
                  <button
                    type='button'
                    onClick={handleEditClick}
                    className='absolute inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100'
                    tabIndex={-1}
                  >
                    <span className='flex items-center gap-2 rounded bg-white/50 p-2 text-sm font-medium hover:bg-white/80'>
                      <Pencil className='size-4' />
                    </span>
                  </button>
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center gap-4 sm:px-5'>
                  <div className='rounded-full border border-dashed p-3'>
                    <IconUpload
                      className='text-muted-foreground size-7'
                      aria-hidden='true'
                    />
                  </div>
                  <div className='space-y-px'>
                    <p className='text-muted-foreground font-medium'>
                      Drag {'n'} drop files here, or click to select files
                    </p>
                    <p className='text-muted-foreground/70 text-sm'>
                      You can upload
                      {maxFiles > 1
                        ? ` ${maxFiles === Infinity ? 'multiple' : maxFiles}
                      files (up to ${formatBytes(maxSize)} each)`
                        : ` a file with ${formatBytes(maxSize)}`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  );
}

function isFileWithPreview(file: File): file is File & { preview: string } {
  return 'preview' in file && typeof file.preview === 'string';
}
