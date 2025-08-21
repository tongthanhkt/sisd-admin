'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import {
  useDashboardQuery,
  usePageDetailHistoryQuery,
  usePageHistoryQuery
} from '@/lib/api/tracking';
import { PAGE_NAME, ViewPage } from '@/constants/tracking';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { ColumnDef } from '@tanstack/react-table';
import { DashboardTracking, PageHistory } from '@/types';
import { skipToken } from '@reduxjs/toolkit/query';

export default function TrackingDashboardPage() {
  const { data: dashboardData } = useDashboardQuery();

  const topPages = useMemo(() => {
    const pages = (dashboardData || [])
      .slice()
      .sort((a, b) => b.total - a.total);
    return pages.map((p) => ({ name: PAGE_NAME[p.page], total: p.total }));
  }, [dashboardData]);

  // Filters for history
  const pageOptions = useMemo(
    () =>
      (dashboardData || []).map((p) => ({ label: p.page, value: p.page })) as {
        label: string;
        value: string;
      }[],
    [dashboardData]
  );

  const [selectedPage, setSelectedPage] = useState<string>(ViewPage.PRODUCTS);
  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);

  const { data: pageHistory } = usePageHistoryQuery({
    page: selectedPage as ViewPage
  });
  const { data: pageDetailHistory } = usePageDetailHistoryQuery(
    selectedDetailId ? { pageDetailId: selectedDetailId } : skipToken
  );

  // Build detail options from dashboard data
  const detailOptions = useMemo(() => {
    const section = (dashboardData || []).find((p) => p.page === selectedPage);
    const details = section?.details || [];
    return details
      .filter((d) => d.pageDetailId)
      .map((d) => ({
        label: d.pageName || d.pageDetailId!,
        value: d.pageDetailId!
      }));
  }, [dashboardData, selectedPage]);

  const historyColumns: ColumnDef<PageHistory[number]>[] = [
    {
      id: 'stt',
      header: 'STT',
      cell: ({ row }) => <div className='text-center'>{row.index + 1}</div>
    },
    { id: 'page', accessorKey: 'page', header: 'Page' },
    { id: 'pageName', accessorKey: 'pageName', header: 'Page name' },
    { id: 'ip', accessorKey: 'ip', header: 'IP' },
    { id: 'city', accessorKey: 'city', header: 'City' },
    { id: 'region', accessorKey: 'region', header: 'Region' },
    { id: 'country', accessorKey: 'country', header: 'Country' },
    { id: 'createdAt', accessorKey: 'createdAt', header: 'Time' }
  ];

  return (
    <div className='space-y-6 p-4'>
      <Card>
        <CardHeader>
          <CardTitle>Lượt truy cập</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{ total: { label: 'Views', color: 'var(--primary)' } }}
            className='h-[300px] w-full'
          >
            <BarChart data={topPages} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='name'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={{ fill: 'var(--primary)', opacity: 0.1 }}
                content={<ChartTooltipContent />}
              />
              <Bar
                dataKey='total'
                fill='var(--primary)'
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

// Lightweight wrapper to reuse existing table infra without routing pagination for now
import { useDataTable } from '@/hooks/use-data-table';
function TrackingHistoryTable({
  data,
  columns
}: {
  data: PageHistory;
  columns: ColumnDef<PageHistory[number]>[];
}) {
  const { table } = useDataTable({ data, columns, pageCount: 1 });
  return (
    <div className='min-h-[520px]'>
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}
