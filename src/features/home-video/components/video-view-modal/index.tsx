'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface VideoViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: {
    id: string;
    fileName: string;
    url: string;
    type: string;
    originalSize: number;
    compressedSize: number;
    createdAt: string;
  };
  title: string;
}

export const VideoViewModal: React.FC<VideoViewModalProps> = ({
  isOpen,
  onClose,
  video,
  title
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] !max-w-[768px] overflow-y-auto'>
        <DialogHeader className='flex flex-row items-center justify-between'>
          <DialogTitle className='text-xl font-semibold'>{title}</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Video Player */}
          <div className='relative aspect-video overflow-hidden rounded-lg bg-black'>
            <video
              src={video.url}
              controls
              className='h-full w-full object-contain'
              preload='metadata'
            >
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Video Information */}
          <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-2'>
            <div className='space-y-2'>
              <div>
                <span className='font-medium text-gray-600'>File Name:</span>
                <p className='text-gray-900'>{video.fileName}</p>
              </div>
            </div>
            <div className='space-y-2'>
              <span className='font-medium text-gray-600'>Original Size:</span>
              <p className='text-gray-900'>
                {formatFileSize(video.originalSize)}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
