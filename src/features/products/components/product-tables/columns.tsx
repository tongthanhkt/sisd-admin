'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { IMortalProduct } from '@/models/MortalProduct';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import Image from 'next/image';
import { CellAction } from './cell-action';
import { CATEGORY_OPTIONS } from './options';

export const columns: ColumnDef<IMortalProduct>[] = [
  {
    id: 'image',
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      return (
        <div className='relative aspect-square w-20'>
          <Image
            src={row.original.image || ''}
            alt={row.original.name || ''}
            fill
            className='rounded-lg object-cover'
          />
        </div>
      );
    }
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<IMortalProduct, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,

    enableColumnFilter: true
  },
  {
    id: 'code',
    accessorKey: 'code',
    header: ({ column }: { column: Column<IMortalProduct, unknown> }) => (
      <DataTableColumnHeader column={column} title='Code' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,

    enableColumnFilter: true
  },
  {
    id: 'category',
    accessorKey: 'category',
    header: ({ column }: { column: Column<IMortalProduct, unknown> }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
    cell: ({ cell }) => {
      const category = cell.getValue<string>();
      return (
        <Badge variant='outline' className='capitalize'>
          {category}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'categories',
      variant: 'multiSelect',
      options: CATEGORY_OPTIONS
    }
  },
  {
    id: 'shortDescription',
    accessorKey: 'shortDescription',
    header: ({ column }: { column: Column<IMortalProduct, unknown> }) => (
      <DataTableColumnHeader column={column} title='Short Description' />
    ),
    cell: ({ cell }) => (
      <div className='max-w-[200px] truncate'>{cell.getValue<string>()}</div>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
