'use client';

import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { ColumnDef, PaginationState, Updater } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { ContactRow } from './columns';
import { useDataTable } from '@/hooks/use-data-table';

interface ContactTableProps {
  data: ContactRow[];
  columns: ColumnDef<ContactRow>[];
  totalItems: number;
  page: number;
  perPage: number;
}

export function ContactTable({
  data,
  columns,
  totalItems,
  page,
  perPage
}: ContactTableProps) {
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
        placeholder='Tìm kiếm theo tên, số điện thoại, email...'
        onChange={(e) => onSearch(e.target.value)}
      />
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
