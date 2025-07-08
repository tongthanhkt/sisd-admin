'use client';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { DOCUMENT_OPTIONS } from '@/constants/document';
import { Column, ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import Image from 'next/image'; // ✅
import { CellAction } from './cell-action';
import { Document } from '@/types';

export const columns: ColumnDef<Document>[] = [
  {
    id: 'file',
    accessorKey: 'file',
    header: 'File',
    cell: ({ row }) => {
      return (
        <div className='m-auto h-full'>
          <Image
            src={'/images/documents/file.svg'}
            alt={'Document image'}
            width={48}
            height={60}
            className='object-contain'
          />
        </div>
      );
    }
  },
  {
    id: 'filename',
    accessorKey: 'filename',
    header: ({ column }: { column: Column<Document, unknown> }) => (
      <DataTableColumnHeader column={column} title='Document name' />
    ),
    cell: ({ cell }) => <div className='w-full'>{cell.getValue<string>()}</div>,

    enableColumnFilter: true
  },
  {
    id: 'category',
    accessorKey: 'category',
    header: ({ column }: { column: Column<Document, unknown> }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
    cell: ({ cell }) => {
      return (
        <div>
          {
            DOCUMENT_OPTIONS.find(
              (option) => option.value === cell.getValue<string>()
            )?.label
          }
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
    header: ({ column }: { column: Column<Document, unknown> }) => (
      <DataTableColumnHeader column={column} title='Created at' />
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
