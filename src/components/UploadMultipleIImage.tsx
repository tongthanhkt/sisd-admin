'use client';

import { IconX, IconUpload } from '@tabler/icons-react';
import Image from 'next/image';
import * as React from 'react';
import Dropzone, {
  type DropzoneProps,
  type FileRejection
} from 'react-dropzone';
import { toast } from 'sonner';

import { useControllableState } from '@/hooks/use-controllable-state';
import { cn, formatBytes } from '@/lib/utils';
import { FormLabel } from './ui/form';

interface UploadMultipleImageProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: File[];
  onValueChange?: React.Dispatch<React.SetStateAction<File[]>>;
  onUpload?: (files: File[]) => Promise<void>;
  accept?: DropzoneProps['accept'];
  maxSize?: DropzoneProps['maxSize'];
  maxFiles?: number;
  multiple?: boolean;
  label?: string;
  disabled?: boolean;
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
    ...rest
  } = props;

  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange
  });

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      );

      const updatedFiles = [...(files || []), ...newFiles].slice(0, maxFiles);
      setFiles(updatedFiles);

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(`File ${file.name} was rejected`);
        });
      }

      if (onUpload && updatedFiles.length > 0) {
        const target =
          updatedFiles.length > 1 ? `${updatedFiles.length} files` : 'file';

        toast.promise(onUpload(updatedFiles), {
          loading: `Uploading ${target}...`,
          success: () => {
            setFiles([]);
            return `${target} uploaded`;
          },
          error: `Failed to upload ${target}`
        });
      }
    },
    [files, maxFiles, onUpload, setFiles]
  );

  const handleRemove = (idx: number) => {
    if (!files) return;

    setFiles((prev) => {
      if (!prev) return [];
      const newArr = prev.filter((_, i) => i !== idx);
      if ('preview' in prev[idx]) {
        URL.revokeObjectURL((prev[idx] as any).preview);
      }
      return newArr;
    });
  };

  // Revoke preview url when component unmounts
  React.useEffect(() => {
    return () => {
      if (!files) return;
      files.forEach((file) => {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn('flex flex-col gap-2', className)} {...rest}>
      <FormLabel>{label}</FormLabel>
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        maxSize={maxSize}
        maxFiles={maxFiles}
        multiple={multiple}
        disabled={disabled || (files && files.length >= maxFiles)}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            className={cn(
              'grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            )}
          >
            {/* Upload box */}
            {(!files || files.length < maxFiles) && (
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
                    src={isFileWithPreview(file) ? file.preview : ''}
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
                    disabled={disabled}
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

function isFileWithPreview(file: File): file is File & { preview: string } {
  return 'preview' in file && typeof file.preview === 'string';
}
