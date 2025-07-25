'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { ICatalogProduct } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

interface FloorProductTableProps {
  data: ICatalogProduct[];
  columns: ColumnDef<ICatalogProduct>[];
  totalItems: number;
  page: number;
  perPage: number;
}

export function FloorProductTable({
  data,
  columns,
  totalItems,
  page,
  perPage
}: FloorProductTableProps) {
  const { table } = useDataTable({
    data,
    columns,
    pageCount: Math.ceil(totalItems / perPage)
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
