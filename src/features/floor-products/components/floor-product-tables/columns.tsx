'use client';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { ICatalog, ICatalogProduct } from '@/types';
import { Column, ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import Image from 'next/image'; // ✅
import { CellAction } from './cell-action';

export const columns: (catalogs: ICatalog[]) => ColumnDef<ICatalogProduct>[] = (
  catalogs: ICatalog[]
) => {
  return [
    {
      id: 'color_name',
      accessorKey: 'color_name',
      header: ({ column }: { column: Column<ICatalogProduct, unknown> }) => (
        <DataTableColumnHeader column={column} title='Color name' />
      ),
      cell: ({ cell }) => (
        <div className='ml-5 w-full'>{cell.getValue<string>()}</div>
      )
    },
    {
      id: 'image_url',
      accessorKey: 'image_url',
      header: ({ column }: { column: Column<ICatalogProduct, unknown> }) => (
        <DataTableColumnHeader column={column} title='Image' />
      ),
      cell: ({ row }) => {
        return (
          <div className='m-auto h-full'>
            <Image
              src={row.original.image_url}
              alt={'Floor product image'}
              width={96}
              height={120}
              className='object-contain'
            />
          </div>
        );
      }
    },
    {
      id: 'color_image_url',
      accessorKey: 'color_image_url',
      header: ({ column }: { column: Column<ICatalogProduct, unknown> }) => (
        <DataTableColumnHeader column={column} title='Color image' />
      ),
      cell: ({ row }) => {
        return (
          <div className='m-auto h-full'>
            <Image
              src={row.original.color_image_url}
              alt={'Floor product image'}
              width={96}
              height={120}
              className='object-contain'
            />
          </div>
        );
      }
    },
    {
      id: 'content',
      accessorKey: 'content',
      header: ({ column }: { column: Column<ICatalogProduct, unknown> }) => (
        <DataTableColumnHeader column={column} title='Content' />
      ),
      cell: ({ cell }) => {
        return (
          <div>
            {cell
              .getValue<string>()
              ?.split('/n ')
              ?.map((item) => <div key={item}>{item}</div>)}
          </div>
        );
      }
    },
    {
      id: 'catalog_id',
      accessorKey: 'catalog_id',
      header: ({ column }: { column: Column<ICatalogProduct, unknown> }) => (
        <DataTableColumnHeader column={column} title='Catalog' />
      ),
      cell: ({ cell }) => {
        const curCatalog = catalogs.find(
          (catalog) => catalog.id === cell.getValue<string>()
        );
        return <div>{curCatalog?.code}</div>;
      }
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }: { column: Column<ICatalogProduct, unknown> }) => (
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
};
