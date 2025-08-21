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
import { PageHistory } from '@/types';
import { skipToken } from '@reduxjs/toolkit/query';

export default function TrackingDashboardPage() {
  const { data: dashboardData } = useDashboardQuery();
  console.log('🚀 ~ TrackingDashboardPage ~ dashboardData:', dashboardData);

  const topPages = useMemo(() => {
    const pages = (dashboardData || [])
      .slice()
      .sort((a, b) => b.total - a.total);
    return pages.map((p) => ({ name: PAGE_NAME[p.page], total: p.total }));
  }, [dashboardData]);

  const productDetailOptions = useMemo(() => {
    const productDetail = (dashboardData || []).find(
      (p) => p.page === ViewPage.PRODUCT_DETAIL
    );
    return (
      productDetail?.details
        ?.map((d) => ({
          label: d.pageName || d.pageDetailId || '',
          value: d.pageDetailId || ''
        }))
        ?.filter((opt) => opt.value) || []
    );
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

  const historyColumns: ColumnDef<PageHistory[number]>[] = [
    {
      id: 'stt',
      header: 'STT',
      cell: ({ row }) => <div className='text-center'>{row.index + 1}</div>
    },
    { id: 'page', accessorKey: 'page', header: 'Page' },
    { id: 'ip', accessorKey: 'ip', header: 'IP' },
    { id: 'city', accessorKey: 'city', header: 'City' },
    { id: 'region', accessorKey: 'region', header: 'Region' },
    { id: 'country', accessorKey: 'country', header: 'Country' },
    { id: 'createdAt', accessorKey: 'createdAt', header: 'Time' }
  ];

  return (
    <div className='h-[calc(100vh-48px)] space-y-6 overflow-y-auto p-4'>
      {/* Overall views summary */}
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

      {/* Details sections */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        {[
          ViewPage.PRODUCT_DETAIL,
          ViewPage.BLOGS_DETAIL,
          ViewPage.DOCUMENTATION_DETAIL
        ].map((section) => {
          const items =
            (dashboardData || [])
              .find((p) => p.page === section)
              ?.details?.slice()
              .sort((a, b) => b.total - a.total) || [];
          const chartData = items.map((d) => ({
            name: d.pageName || d.pageDetailId || 'Unknown',
            total: d.total
          }));
          return (
            <Card key={section}>
              <CardHeader>
                <CardTitle>
                  {section === ViewPage.PRODUCT_DETAIL &&
                    'Product Detail Views'}
                  {section === ViewPage.BLOGS_DETAIL && 'Blog Detail Views'}
                  {section === ViewPage.DOCUMENTATION_DETAIL &&
                    'Document Detail Views'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    total: { label: 'Views', color: 'var(--primary)' }
                  }}
                  className='h-[280px] w-full'
                >
                  <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
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
          );
        })}
      </div>

      {/* History section with tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử truy cập</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <div className='mb-2 text-sm font-medium'>Trang</div>
              <Select
                value={selectedPage}
                onValueChange={(v) => {
                  setSelectedPage(v);
                  setSelectedDetailId(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Chọn trang' />
                </SelectTrigger>
                <SelectContent>
                  {pageOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <TrackingHistoryTable
            data={pageHistory || []}
            columns={historyColumns}
          />

          <div>
            <div className='mb-2 text-sm font-medium'>Chi tiết trang</div>
            <Select
              value={selectedDetailId || ''}
              onValueChange={(v) => setSelectedDetailId(v)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Chọn trang chi tiết (tuỳ chọn)' />
              </SelectTrigger>
              <SelectContent>
                {productDetailOptions.map((opt, index) => (
                  <SelectItem key={index} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <TrackingHistoryTable
            data={pageDetailHistory || []}
            columns={historyColumns}
          />
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
    <div className='h-[520px]'>
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}
