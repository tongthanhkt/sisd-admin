'use client';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export interface ContactRow {
  id: string;
  fullname: string;
  phone_number: string;
  email: string;
  createdAt: string;
}

export const columns: ColumnDef<ContactRow>[] = [
  {
    id: 'stt',
    header: 'STT',
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableColumnFilter: false
  },
  {
    id: 'fullname',
    accessorKey: 'fullname',
    header: ({ column }: { column: Column<ContactRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Họ và tên' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
    enableColumnFilter: true
  },
  {
    id: 'phone_number',
    accessorKey: 'phone_number',
    header: ({ column }: { column: Column<ContactRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Số điện thoại' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
    enableColumnFilter: true
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: ({ column }: { column: Column<ContactRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
    enableColumnFilter: true
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: ({ column }: { column: Column<ContactRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Thời gian gửi' />
    ),
    cell: ({ cell }) => {
      const date = cell.getValue<string>();
      return format(new Date(date), 'dd/MM/yyyy HH:mm');
    },
    enableSorting: true,
    enableColumnFilter: false
  }
];
