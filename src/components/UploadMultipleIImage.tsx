'use client';

import { IconUpload, IconX } from '@tabler/icons-react';
import Image from 'next/image';
import * as React from 'react';
import Dropzone, { type DropzoneProps } from 'react-dropzone';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useMemo, useState } from 'react';

import { useUploadFileMixed } from '@/hooks/use-upload-file';
import { cn, formatBytes, isFile, isUrl } from '@/lib/utils';
import { IUploadMultipleImageItem } from '@/types';
import { FormLabel, FormMessage } from './ui/form';
import { GripVerticalIcon } from 'lucide-react';

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
  required?: boolean;
}

// Custom hook to manage preview URL for File or string
function usePreviewUrl(fileOrUrl: File | string) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | undefined;
    if (fileOrUrl instanceof File) {
      objectUrl = URL.createObjectURL(fileOrUrl);
      setPreview(objectUrl);
    } else if (typeof fileOrUrl === 'string') {
      setPreview(fileOrUrl);
    } else {
      setPreview(null);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [fileOrUrl]);

  return preview;
}

function SortableImageItem({
  item,
  idx,
  disabled,
  handleRemoveImage,
  handleCaptionChange,
  withCaption,
  cardClassName
}: {
  item: IUploadMultipleImageItem;
  idx: number;
  disabled: boolean;
  handleRemoveImage: (idx: number) => void;
  handleCaptionChange: (idx: number, caption: string) => void;
  withCaption: boolean;
  getPreviewUrl?: (item: File | string) => string; // not used anymore
  cardClassName?: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id || idx });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  // Use the custom hook for preview URL
  const previewUrl = usePreviewUrl(item.file);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative flex h-28 items-center justify-center overflow-hidden rounded-lg bg-gray-100',
        isDragging && 'ring-2 ring-blue-400',
        cardClassName
      )}
    >
      {/* Nút delete và drag cạnh nhau, phía trên ảnh */}
      <div className='absolute top-1 right-1 z-10 flex gap-1'>
        <button
          type='button'
          onClick={() => handleRemoveImage(idx)}
          className='rounded-full bg-white/80 p-1'
          title='Delete'
          disabled={disabled}
        >
          <IconX className='size-4 text-red-500' />
        </button>
        <button
          type='button'
          {...attributes}
          {...listeners}
          className='cursor-grab rounded-full bg-white/80 p-1'
          title='Drag to reorder'
          disabled={disabled}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag icon */}
          <GripVerticalIcon className='size-4' />
        </button>
      </div>
      {/* Ảnh */}
      {previewUrl ? (
        <Image
          src={previewUrl}
          alt={
            isFile(item.file) ? (item.file as File).name : `Image ${idx + 1}`
          }
          fill
          className='object-cover'
          style={{ maxHeight: '100%', maxWidth: '100%' }}
        />
      ) : null}
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
  );
}

export const UploadMultipleIImage = (props: UploadMultipleImageProps) => {
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    accept = { 'image/*': [] },
    maxSize = 1024 * 1024 * 2,
    maxFiles = 10,
    multiple = true,
    label = 'Others Images',
    disabled = false,
    className,
    error,
    helperText,
    cardClassName,
    listClassName,
    withCaption = false,
    required = false,
    ...rest
  } = props;

  const files = valueProp ?? [];
  const setFiles = onValueChange ?? (() => { });

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

  // DnD handler for images
  const handleDragEndImage = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = files.findIndex((f) => f.id === active.id);
      const newIndex = files.findIndex((f) => f.id === over?.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setFiles(arrayMove(files, oldIndex, newIndex));
      }
    }
  };

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const activeItem = files.find((f) => f.id === activeId);

  return (
    <div className={cn('flex flex-col gap-2', className)} {...rest}>
      <FormLabel className={cn(error && 'text-destructive')}>
        {label}
        {required && <span className='text-destructive'>*</span>}
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
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEndImage}
            onDragStart={(event) => setActiveId(event.active.id as string)}
            onDragCancel={() => setActiveId(null)}
            onDragOver={() => { }}
          >
            <SortableContext
              items={files.map((item, idx) => item.id || idx)}
              strategy={verticalListSortingStrategy}
            >
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
                {/* Images DnD */}
                {files.map((item, idx) => (
                  <SortableImageItem
                    key={item.id || idx}
                    item={item}
                    idx={idx}
                    disabled={disabled}
                    handleRemoveImage={handleRemoveImage}
                    handleCaptionChange={handleCaptionChange}
                    withCaption={withCaption}
                    cardClassName={cardClassName}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>
              {activeItem ? (
                <SortableImageItem
                  item={activeItem}
                  idx={-1}
                  disabled={true}
                  handleRemoveImage={() => { }}
                  handleCaptionChange={() => { }}
                  withCaption={withCaption}
                  cardClassName={cardClassName}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
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
