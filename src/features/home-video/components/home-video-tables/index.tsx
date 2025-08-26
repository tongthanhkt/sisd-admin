'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { useGetHomeVideosQuery } from '@/lib/api/videoApi';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { columns } from './columns';
import { useDataTable } from '@/hooks/use-data-table';

export default function HomeVideoTable() {
  const { data, isLoading, error } = useGetHomeVideosQuery();

  const homeVideos = data?.data || [];

  const { table } = useDataTable({
    data: homeVideos,
    columns,
    enableAdvancedFilter: false,
    pageCount: 1
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

  return <DataTable table={table} />;
}
