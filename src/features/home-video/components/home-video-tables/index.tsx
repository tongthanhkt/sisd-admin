'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import {
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_DEFAULT_PER_PAGE
} from '@/constants/pagination';
import { useDataTable } from '@/hooks/use-data-table';
import { useGetHomeVideosQuery } from '@/lib/api/videoApi';
import { PaginationState, Updater } from '@tanstack/react-table';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { columns } from './columns';

export default function HomeVideoTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get pagination params from URL
  const page = Number(searchParams.get('page')) || PAGINATION_DEFAULT_PAGE;
  const limit =
    Number(searchParams.get('limit')) || PAGINATION_DEFAULT_PER_PAGE;

  const { data, isLoading, error } = useGetHomeVideosQuery({
    page,
    limit
  });

  const homeVideos = data?.data || [];
  const totalItems = data?.pagination?.total || 0;

  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex: page - 1,
      pageSize: limit
    }),
    [page, limit]
  );

  const onPaginationChange = useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      const value =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(pagination)
          : updaterOrValue;
      const params = new URLSearchParams(searchParams);
      params.set('page', String(value.pageIndex + 1));
      params.set('limit', String(value.pageSize));
      router.push(`?${params.toString()}`);
    },
    [router, pagination, searchParams]
  );

  const { table } = useDataTable({
    data: homeVideos,
    columns,
    pageCount: Math.ceil(totalItems / limit),
    pagination,
    onPaginationChange,
    enableColumnFilters: true
  });

  if (isLoading) {
    return <DataTableSkeleton columnCount={3} filterCount={0} />;
  }

  if (error) {
    return (
      <div className='flex h-32 items-center justify-center'>
        <p className='text-red-500'>Error loading home videos</p>
      </div>
    );
  }

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
