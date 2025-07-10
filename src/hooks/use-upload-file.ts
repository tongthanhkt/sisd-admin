import { useCallback, useEffect, useState } from 'react';
import { type FileRejection } from 'react-dropzone';
import { toast } from 'sonner';
import { useControllableState } from '@/hooks/use-controllable-state';
import { formatBytes, isFile, isUrl } from '@/lib/utils';

interface UseUploadFileOptions {
  value?: File[];
  onValueChange?: React.Dispatch<React.SetStateAction<File[]>>;
  maxFiles?: number;
  maxSize?: number;
  onUpload?: (files: File[]) => Promise<void>;
  mode?: 'single' | 'multiple';
}

interface UseUploadFileReturn {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[] | undefined>>;
  onDrop: (acceptedFiles: File[], rejectedFiles: FileRejection[]) => void;
  handleRemove: (index: number) => void;
  isUploading: boolean;
  canAddMore: boolean;
}

// New hook for mixed File and string values
interface UseUploadFileMixedOptions {
  value?: (File | string)[];
  onValueChange?: React.Dispatch<React.SetStateAction<(File | string)[]>>;
  maxFiles?: number;
  maxSize?: number;
  onUpload?: (files: (File | string)[]) => Promise<void>;
  mode?: 'single' | 'multiple';
}

interface UseUploadFileMixedReturn {
  files: (File | string)[];
  setFiles: React.Dispatch<React.SetStateAction<(File | string)[] | undefined>>;
  onDrop: (acceptedFiles: File[], rejectedFiles: FileRejection[]) => void;
  handleRemove: (index: number) => void;
  isUploading: boolean;
  canAddMore: boolean;
}

export function useUploadFileMixed({
  value,
  onValueChange,
  maxFiles = 1,
  maxSize = 1024 * 1024 * 2, // 2MB default
  onUpload,
  mode = 'single'
}: UseUploadFileMixedOptions = {}): UseUploadFileMixedReturn {
  const [files, setFiles] = useControllableState({
    prop: value,
    onChange: onValueChange
  });
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Additional size validation
      const validFiles = acceptedFiles.filter((file) => {
        if (file.size > maxSize) {
          toast.error(
            `File ${file.name} is too large. Maximum size is ${formatBytes(maxSize)}`
          );
          return false;
        }
        return true;
      });

      const newFiles = validFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      );

      let updatedFiles: (File | string)[];

      if (mode === 'single') {
        // For single file upload, replace existing files
        updatedFiles = newFiles.slice(0, 1);
      } else {
        // For multiple file upload, append new files up to maxFiles limit
        updatedFiles = [...(files || []), ...newFiles].slice(0, maxFiles);
      }

      setFiles(updatedFiles);

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file, errors }) => {
          const errorMessage = errors
            .map((error) => {
              if (error.code === 'file-too-large') {
                return `File ${file.name} is too large. Maximum size is ${formatBytes(maxSize)}`;
              }
              if (error.code === 'file-invalid-type') {
                return `File ${file.name} has invalid type`;
              }
              return `File ${file.name} was rejected: ${error.message}`;
            })
            .join(', ');
          toast.error(errorMessage);
        });
      }

      if (onUpload && updatedFiles.length > 0) {
        const target =
          updatedFiles.length > 1 ? `${updatedFiles.length} files` : 'file';

        setIsUploading(true);
        toast.promise(onUpload(updatedFiles), {
          loading: `Uploading ${target}...`,
          success: () => {
            setFiles([]);
            setIsUploading(false);
            return `${target} uploaded successfully`;
          },
          error: () => {
            setIsUploading(false);
            return `Failed to upload ${target}`;
          }
        });
      }
    },
    [files, maxFiles, maxSize, onUpload, setFiles, mode]
  );

  const handleRemove = useCallback(
    (index: number) => {
      setFiles((prev) => {
        if (!prev) return [];
        const newArr = prev.filter((_, i) => i !== index);
        const removedItem = prev[index];
        if (isFile(removedItem) && isFileWithPreview(removedItem)) {
          URL.revokeObjectURL(removedItem.preview);
        }
        return newArr;
      });
    },
    [setFiles]
  );

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (files) {
        files.forEach((file) => {
          if (isFile(file) && isFileWithPreview(file)) {
            URL.revokeObjectURL(file.preview);
          }
        });
      }
    };
  }, [files]);

  const canAddMore = !files || files.length < maxFiles;

  return {
    files: files || [],
    setFiles: setFiles as React.Dispatch<
      React.SetStateAction<(File | string)[] | undefined>
    >,
    onDrop,
    handleRemove,
    isUploading,
    canAddMore
  };
}

export function useUploadFile({
  value,
  onValueChange,
  maxFiles = 1,
  maxSize = 1024 * 1024 * 2, // 2MB default
  onUpload,
  mode = 'single'
}: UseUploadFileOptions = {}): UseUploadFileReturn {
  const [files, setFiles] = useControllableState({
    prop: value,
    onChange: onValueChange
  });
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Additional size validation
      const validFiles = acceptedFiles.filter((file) => {
        if (file.size > maxSize) {
          toast.error(
            `File ${file.name} is too large. Maximum size is ${formatBytes(maxSize)}`
          );
          return false;
        }
        return true;
      });

      const newFiles = validFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      );

      let updatedFiles: File[];

      if (mode === 'single') {
        // For single file upload, replace existing files
        updatedFiles = newFiles.slice(0, 1);
      } else {
        // For multiple file upload, append new files up to maxFiles limit
        updatedFiles = [...(files || []), ...newFiles].slice(0, maxFiles);
      }

      setFiles(updatedFiles);

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file, errors }) => {
          const errorMessage = errors
            .map((error) => {
              if (error.code === 'file-too-large') {
                return `File ${file.name} is too large. Maximum size is ${formatBytes(maxSize)}`;
              }
              if (error.code === 'file-invalid-type') {
                return `File ${file.name} has invalid type`;
              }
              return `File ${file.name} was rejected: ${error.message}`;
            })
            .join(', ');
          toast.error(errorMessage);
        });
      }

      if (onUpload && updatedFiles.length > 0) {
        const target =
          updatedFiles.length > 1 ? `${updatedFiles.length} files` : 'file';

        setIsUploading(true);
        toast.promise(onUpload(updatedFiles), {
          loading: `Uploading ${target}...`,
          success: () => {
            setFiles([]);
            setIsUploading(false);
            return `${target} uploaded successfully`;
          },
          error: () => {
            setIsUploading(false);
            return `Failed to upload ${target}`;
          }
        });
      }
    },
    [files, maxFiles, maxSize, onUpload, setFiles, mode]
  );

  const handleRemove = useCallback(
    (index: number) => {
      setFiles((prev) => {
        if (!prev) return [];
        const newArr = prev.filter((_, i) => i !== index);
        if ('preview' in prev[index]) {
          URL.revokeObjectURL((prev[index] as any).preview);
        }
        return newArr;
      });
    },
    [setFiles]
  );

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (files) {
        files.forEach((file) => {
          if (isFileWithPreview(file)) {
            URL.revokeObjectURL(file.preview);
          }
        });
      }
    };
  }, [files]);

  const canAddMore = !files || files.length < maxFiles;

  return {
    files: files || [],
    setFiles: setFiles as React.Dispatch<
      React.SetStateAction<File[] | undefined>
    >,
    onDrop,
    handleRemove,
    isUploading,
    canAddMore
  };
}

function isFileWithPreview(file: File): file is File & { preview: string } {
  return 'preview' in file && typeof file.preview === 'string';
}
