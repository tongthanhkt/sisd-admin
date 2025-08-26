'use client';

import { IconUpload } from '@tabler/icons-react';
import * as React from 'react';
import Dropzone, { type DropzoneProps } from 'react-dropzone';

import { useControllableState } from '@/hooks/use-controllable-state';
import { useUploadFileMixed } from '@/hooks/use-upload-file';
import { cn, formatBytes, isFile, isUrl } from '@/lib/utils';
import { Pencil, Trash } from 'lucide-react';
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
  disabled?: boolean;
  deletable?: boolean;
}

export function UploadVideo(props: FileUploaderProps) {
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    accept = { 'video/*': [] },
    maxSize = 1024 * 1024 * 50,
    maxFiles = 1,
    className,
    label = 'Video',
    required = false,
    disabled,
    deletable = true
  } = props;

  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange
  });

  const { onDrop } = useUploadFileMixed({
    value: files,
    onValueChange: setFiles as React.Dispatch<
      React.SetStateAction<(File | string)[]>
    >,
    maxFiles,
    maxSize,
    onUpload,
    mode: 'single'
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [videoUrl, setVideoUrl] = React.useState('');

  React.useEffect(() => {
    let objectUrl: string | null = null;

    if (files && files.length > 0) {
      const item = files[0];
      if (isFile(item)) {
        objectUrl = URL.createObjectURL(item);
        setVideoUrl(objectUrl);
      } else if (isUrl(item)) {
        setVideoUrl(item);
      }
    } else {
      setVideoUrl('');
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [files]);

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openFileDialog();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles([]);
  };

  return (
    <div className='flex flex-col gap-2'>
      <FormLabel>
        {label} {required && <span className='text-destructive'>*</span>}
      </FormLabel>
      <div className='relative flex flex-col gap-6 overflow-hidden'>
        <Dropzone
          onDrop={!disabled ? onDrop : undefined}
          accept={accept}
          maxSize={maxSize}
          maxFiles={maxFiles}
          multiple={false}
          noClick={files && files.length > 0}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={cn(
                'group border-muted-foreground/25 hover:bg-muted/25 relative grid h-full w-full place-items-center rounded-lg border-2 border-dashed px-5 py-2.5 text-center transition',
                'ring-offset-background focus-visible:ring-ring object-contain focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden',
                isDragActive && 'border-muted-foreground/50',
                className
              )}
              style={{ overflow: 'hidden' }}
              onClick={
                !files || files.length === 0 ? openFileDialog : undefined
              }
            >
              <input
                {...getInputProps({ refKey: 'ref' })}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
              {videoUrl ? (
                <div className='relative flex items-center justify-center'>
                  <video
                    src={videoUrl}
                    className='z-0 h-[400px] w-auto rounded-md object-contain'
                    controls
                    playsInline
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className='absolute top-2 right-2 z-50 flex gap-2'>
                    {deletable && (
                      <button
                        type='button'
                        onClick={handleDeleteClick}
                        className='flex cursor-pointer items-center justify-center rounded-full bg-slate-700 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-slate-800'
                      >
                        <Trash className='size-4' />
                        <span className='sr-only'>Delete video</span>
                      </button>
                    )}
                    {!disabled && (
                      <button
                        type='button'
                        onClick={handleEditClick}
                        className={cn(
                          'flex cursor-pointer items-center justify-center rounded-full bg-slate-700 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-slate-800'
                        )}
                        tabIndex={-1}
                        disabled={disabled}
                      >
                        <Pencil className='size-4' />
                        <span className='sr-only'>Change video</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className='flex h-[400px] flex-col items-center justify-center gap-4 sm:px-5'
                  onClick={openFileDialog}
                >
                  <div className='rounded-full border border-dashed p-3'>
                    <IconUpload
                      className='text-muted-foreground size-7'
                      aria-hidden='true'
                    />
                  </div>
                  <div className='space-y-px'>
                    <p className='text-muted-foreground font-medium'>
                      Drag {'n'} drop videos here, or click to select a video
                    </p>
                    <p className='text-muted-foreground/70 text-sm'>
                      You can upload
                      {maxFiles > 1
                        ? ` ${maxFiles === Infinity ? 'multiple' : maxFiles} videos (up to ${formatBytes(maxSize)} each)`
                        : ` a video with ${formatBytes(maxSize)}`}
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
