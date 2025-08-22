'use client';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { IFaqRequest } from '@/types';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<IFaqRequest>[] = [
  {
    id: 'stt',
    header: 'STT',
    cell: ({ row }) => <div className='text-center'>{row.index + 1}</div>,
    enableSorting: false,
    enableColumnFilter: false,
    size: 100,
    minSize: 50,
    maxSize: 100,
    enableResizing: false
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<IFaqRequest, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
    enableColumnFilter: true,
    size: 200,
    minSize: 20,
    maxSize: 300
  },
  {
    id: 'body',
    accessorKey: 'body',
    header: ({ column }: { column: Column<IFaqRequest, unknown> }) => (
      <DataTableColumnHeader column={column} title='Câu hỏi' />
    ),
    cell: ({ cell }) => {
      const body = cell.getValue<IFaqRequest['body']>();
      return (
        <div className='grid grid-cols-1 gap-2'>
          {body.map((item) => (
            <div key={item.question}>{item.question}</div>
          ))}
        </div>
      );
    },
    size: 400,
    minSize: 300
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
    size: 120,
    minSize: 120,
    maxSize: 120,
    enableResizing: false
  }
];
