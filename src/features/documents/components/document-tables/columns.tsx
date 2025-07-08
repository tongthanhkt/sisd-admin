'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { BLOG_CATEGORIES_LABELS } from '@/constants/blog';
import { DOCUMENT_OPTIONS } from '@/constants/document';
import { IBlog } from '@/models/Blog';
import { Column, ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import Image from 'next/image'; // ✅
import { CellAction } from './cell-action';

export const columns: ColumnDef<IBlog>[] = [
  {
    id: 'file',
    accessorKey: 'file',
    header: 'File',
    cell: ({ row }) => {
      const imageSrc =
        row.original.imageSrc || row.original.thumbnail || '/placeholder.png';

      return (
        <div className='relative aspect-square w-20 overflow-hidden rounded-lg'>
          <Image
            src={imageSrc}
            alt={row.original.title || 'Blog image'}
            fill
            className='object-cover'
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
      options: DOCUMENT_OPTIONS
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
