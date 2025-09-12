'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { VIDEO_PAGE_LABEL } from '@/constants/video';

export type HomeVideo = {
  id: string;
  name: string;
  videoId: string;
  createdAt: string;
  updatedAt: string;
  video: {
    id: string;
    fileName: string;
    url: string;
    type: string;
    originalSize: number;
    compressedSize: number;
    createdAt: string;
  };
};

export const columns: ColumnDef<HomeVideo>[] = [
  {
    id: 'stt',
    header: 'STT',
    cell: ({ row }) => {
      return <div className='w-[50px]'>{row.index + 1}</div>;
    }
  },
  {
    accessorKey: 'name',
    header: 'Tên',
    cell: ({ row }) => {
      return (
        <div className='max-w-[300px] truncate font-medium'>
          {row.getValue('name')}
        </div>
      );
    }
  },
  {
    accessorKey: 'page',
    header: 'Trang',
    cell: ({ row }) => {
      return (
        <div className='max-w-[300px] truncate font-medium'>
          {
            VIDEO_PAGE_LABEL[
              row.getValue('page') as keyof typeof VIDEO_PAGE_LABEL
            ]
          }
        </div>
      );
    }
  },

  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
