'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { ICatalog } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

interface CatalogTableProps {
  data: ICatalog[];
  columns: ColumnDef<ICatalog>[];
  perPage: number;
}

export function CatalogTable({ data, columns, perPage }: CatalogTableProps) {
  const { table } = useDataTable({
    data: data,
    columns,
    pageCount: Math.ceil(data.length / perPage)
  });
  console.log('🚀 ~ CatalogTable ~ table:', table);

  return (
    <DataTable table={table}>
      <div className='flex items-end justify-between'>
        <DataTableToolbar table={table} />
      </div>
    </DataTable>
  );
}
