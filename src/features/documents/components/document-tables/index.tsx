'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef, PaginationState, Updater } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { IBlog } from '@/models/Blog';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { Input } from '@/components/ui/input';

interface DocumentTableProps {
  data: IBlog[];
  columns: ColumnDef<IBlog>[];
  totalItems: number;
  page: number;
  perPage: number;
}

export function DocumentTable({
  data,
  columns,
  totalItems,
  page,
  perPage
}: DocumentTableProps) {
  const router = useRouter();

  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex: page - 1,
      pageSize: perPage
    }),
    [page, perPage]
  );

  const onPaginationChange = useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      const value =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(pagination)
          : updaterOrValue;
      const params = new URLSearchParams(window.location.search);
      params.set('page', String(value.pageIndex + 1));
      params.set('perPage', String(value.pageSize));
      router.push(`?${params.toString()}`);
    },
    [router, pagination]
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: Math.ceil(totalItems / perPage),
    pagination,
    onPaginationChange,
    enableColumnFilters: true,
    enableSorting: true,
    enableMultiSort: true
  });

  const onSearch = useMemo(() => {
    let timeout: NodeJS.Timeout;
    return (value: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const params = new URLSearchParams();
        params.set('search', value);
        router.push(`?${params.toString()}`);
      }, 500);
    };
  }, [router]);

  return (
    <DataTable table={table}>
      <Input
        type='text'
        placeholder='Search documents...'
        onChange={(e) => onSearch(e.target.value)}
      />
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
