'use client';

import { IconUpload } from '@tabler/icons-react';
import Image from 'next/image';
import * as React from 'react';
import Dropzone, {
  type DropzoneProps,
  type FileRejection
} from 'react-dropzone';
import { toast } from 'sonner';

import { useControllableState } from '@/hooks/use-controllable-state';
import { cn, formatBytes } from '@/lib/utils';
import { Pencil } from 'lucide-react';
import { FormLabel } from './ui/form';

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: File[];
  onValueChange?: React.Dispatch<React.SetStateAction<File[]>>;
  onUpload?: (files: File[]) => Promise<void>;
  accept?: DropzoneProps['accept'];
  maxSize?: DropzoneProps['maxSize'];
  maxFiles?: DropzoneProps['maxFiles'];
  multiple?: boolean;
}

export function UploadImage(props: FileUploaderProps) {
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    accept = { 'image/*': [] },
    maxSize = 1024 * 1024 * 2,
    maxFiles = 1,
    multiple = false,
    className
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

      const updatedFiles = newFiles.slice(0, 1);

      setFiles(updatedFiles);

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(`File ${file.name} was rejected`);
        });
      }

      if (
        onUpload &&
        updatedFiles.length > 0 &&
        updatedFiles.length <= maxFiles
      ) {
        const target =
          updatedFiles.length > 0 ? `${updatedFiles.length} files` : `file`;

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

    [maxFiles, , onUpload, setFiles]
  );

  function onRemove(index: number) {
    if (!files) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onValueChange?.(newFiles);
  }

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

  // Helper to trigger file input click
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  return (
    <div className='flex flex-col gap-2'>
      <FormLabel>Thumbnail</FormLabel>
      <div className='relative flex flex-col gap-6 overflow-hidden'>
        <Dropzone
          onDrop={onDrop}
          accept={accept}
          maxSize={maxSize}
          maxFiles={maxFiles}
          multiple={maxFiles > 1 || multiple}
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
              {files && files.length > 0 && isFileWithPreview(files[0]) ? (
                <div className='relative flex h-full w-full items-center justify-center'>
                  <Image
                    src={files[0].preview}
                    alt={files[0].name}
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
