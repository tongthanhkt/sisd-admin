'use client';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { ICatalog } from '@/types';
import { Column, ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import Image from 'next/image'; // ✅
import { CellAction } from './cell-action';

export const columns: ColumnDef<ICatalog>[] = [
  {
    id: 'code',
    accessorKey: 'code',
    header: ({ column }: { column: Column<ICatalog, unknown> }) => (
      <DataTableColumnHeader column={column} title='Catalog' />
    ),
    cell: ({ cell }) => (
      <div className='ml-5 w-full'>{cell.getValue<string>()}</div>
    )
  },
  {
    id: 'quantity',
    accessorKey: 'quantity',
    header: ({ column }: { column: Column<ICatalog, unknown> }) => (
      <DataTableColumnHeader column={column} title='Product Quantity' />
    ),
    cell: ({ row }) => {
      return (
        <div className='ml-5 w-full'>{row?.original?.products?.length}</div>
      );
    }
  },

  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: ({ column }: { column: Column<ICatalog, unknown> }) => (
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
