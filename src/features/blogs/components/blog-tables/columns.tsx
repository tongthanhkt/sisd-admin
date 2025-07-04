'use client';

import { ColumnDef, Column } from '@tanstack/react-table';
import { IBlog } from '@/models/Blog';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Text } from 'lucide-react';
import { CellAction } from './cell-action';
import {
  BLOG_CATEGORIES_LABELS,
  BLOG_CATEGORIES_OPTIONS
} from '@/constants/blog';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

const categories = [
  { label: 'Tin tức', value: 'news' },
  { label: 'Sản phẩm', value: 'products' },
  { label: 'Giải pháp', value: 'solutions' }
];

export const columns: ColumnDef<IBlog>[] = [
  {
    id: 'image',
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      return (
        <div className='relative aspect-square w-20'>
          <img
            src={
              row.original.imageSrc ||
              row.original.thumbnail ||
              '/placeholder.png'
            }
            alt={row.original.title || 'Blog image'}
            className='h-full w-full rounded-lg object-cover'
          />
        </div>
      );
    }
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: ({ column }: { column: Column<IBlog, unknown> }) => (
      <DataTableColumnHeader column={column} title='Tiêu đề' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,

    enableColumnFilter: true
  },
  {
    id: 'categories',
    accessorKey: 'categories',
    header: ({ column }: { column: Column<IBlog, unknown> }) => (
      <DataTableColumnHeader column={column} title='Danh mục' />
    ),
    cell: ({ cell }) => {
      const category = cell.getValue<string[]>();
      return (
        <div className='flex flex-wrap gap-2'>
          {category?.map((c) => (
            <Badge variant='outline' className='capitalize' key={c}>
              {BLOG_CATEGORIES_LABELS[c]}
            </Badge>
          ))}
        </div>
      );
    },
    meta: {
      label: 'Categories',
      variant: 'multiSelect',
      options: BLOG_CATEGORIES_OPTIONS
    },
    enableColumnFilter: true
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: ({ column }: { column: Column<IBlog, unknown> }) => (
      <DataTableColumnHeader column={column} title='Ngày tạo' />
    ),
    cell: ({ cell }) => {
      const date = cell.getValue<string>();
      return format(new Date(date), 'dd/MM/yyyy');
    },
    enableSorting: true,
    enableColumnFilter: false
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
