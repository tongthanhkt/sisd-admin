'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { PAGE_NAME, ViewPage } from '@/constants/tracking';
import {
  useDashboardQuery,
  usePageDetailHistoryQuery,
  usePageHistoryQuery
} from '@/lib/api/tracking';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis
} from 'recharts';

import { PageHistory } from '@/types';
import { skipToken } from '@reduxjs/toolkit/query';
import { ColumnDef } from '@tanstack/react-table';

export default function TrackingDashboardPage() {
  const { data: dashboardData, isLoading: isDashboardLoading } =
    useDashboardQuery();
  const pageHistoryRef = useRef<HTMLDivElement | null>(null);
  const pageDetailRef = useRef<HTMLDivElement | null>(null);
  const blogDetailRef = useRef<HTMLDivElement | null>(null);
  const documentationDetailRef = useRef<HTMLDivElement | null>(null);

  const getPageLabel = (pageKey: string): string =>
    (PAGE_NAME as Record<string, string>)[pageKey] || pageKey;

  const totalViews = useMemo(
    () => (dashboardData || []).reduce((s, p) => s + (p.total || 0), 0),
    [dashboardData]
  );
  const sortedPages = useMemo(
    () => (dashboardData || []).slice().sort((a, b) => b.total - a.total),
    [dashboardData]
  );
  const topKpi = sortedPages[0];
  const pagesCount = sortedPages.length;
  const topShare = useMemo(
    () =>
      totalViews > 0 && topKpi
        ? Math.round((topKpi.total * 100) / totalViews)
        : 0,
    [topKpi, totalViews]
  );
  // Wrap long X-axis labels into at most 2 lines for the main bar chart
  const TwoLineXAxisTick = ({ x, y, payload, maxChars = 16 }: any) => {
    const value: string = payload?.value ?? '';
    if (!value) return null;
    let first = value;
    let second = '';
    if (value.length > maxChars) {
      const cutAt = value.lastIndexOf(' ', maxChars);
      const idx = cutAt > 3 ? cutAt : maxChars;
      first = value.slice(0, idx).trim();
      second = value.slice(idx).trim();
    }
    return (
      <g transform={`translate(${x},${y})`}>
        <text textAnchor='middle' fill='currentColor' className='text-[12px]'>
          <tspan x={0} dy={0}>
            {first}
          </tspan>
          {second ? (
            <tspan x={0} dy={12}>
              {second}
            </tspan>
          ) : null}
        </text>
      </g>
    );
  };

  const topPages = useMemo(() => {
    const pages = (dashboardData || [])
      .slice()
      .sort((a, b) => b.total - a.total);
    return pages.map((p) => ({
      name: getPageLabel(p.page),
      total: p.total,
      page: p.page
    }));
  }, [dashboardData]);
  // console.debug('topPages', topPages);

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

  const blogDetailOptions = useMemo(() => {
    const blogDetail = (dashboardData || []).find(
      (p) => p.page === ViewPage.BLOGS_DETAIL
    );
    return (
      blogDetail?.details
        ?.map((d) => ({
          label: d.pageName || d.pageDetailId || '',
          value: d.pageDetailId || ''
        }))
        ?.filter((opt) => opt.value) || []
    );
  }, [dashboardData]);

  const documentationDetailOptions = useMemo(() => {
    const documentationDetail = (dashboardData || []).find(
      (p) => p.page === ViewPage.DOCUMENTATION_DETAIL
    );
    return (
      documentationDetail?.details
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
      (dashboardData || []).map((p) => ({
        label: getPageLabel(p.page),
        value: p.page
      })) as {
        label: string;
        value: string;
      }[],
    [dashboardData]
  );

  const [selectedPage, setSelectedPage] = useState<string>(ViewPage.HOMEPAGE);
  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);
  const [selectedBlogDetailId, setSelectedBlogDetailId] = useState<
    string | null
  >(null);
  const [selectedDocumentationDetailId, setSelectedDocumentationDetailId] =
    useState<string | null>(null);

  // Default selections: pick first item when options > 0 (runs after state declared)
  useEffect(() => {
    if (!selectedDetailId && productDetailOptions.length > 0) {
      setSelectedDetailId(productDetailOptions[0].value);
    }
  }, [productDetailOptions, selectedDetailId]);

  useEffect(() => {
    if (!selectedBlogDetailId && blogDetailOptions.length > 0) {
      setSelectedBlogDetailId(blogDetailOptions[0].value);
    }
  }, [blogDetailOptions, selectedBlogDetailId]);

  useEffect(() => {
    if (
      !selectedDocumentationDetailId &&
      documentationDetailOptions.length > 0
    ) {
      setSelectedDocumentationDetailId(documentationDetailOptions[0].value);
    }
  }, [documentationDetailOptions, selectedDocumentationDetailId]);

  const { data: pageHistory } = usePageHistoryQuery({
    page: selectedPage as ViewPage
  });

  const { data: pageDetailHistory } = usePageDetailHistoryQuery(
    selectedDetailId ? { pageDetailId: selectedDetailId } : skipToken
  );

  const { data: blogDetailHistory } = usePageDetailHistoryQuery(
    selectedBlogDetailId ? { pageDetailId: selectedBlogDetailId } : skipToken
  );

  const { data: documentationDetailHistory } = usePageDetailHistoryQuery(
    selectedDocumentationDetailId
      ? { pageDetailId: selectedDocumentationDetailId }
      : skipToken
  );

  const historyColumns: ColumnDef<PageHistory[number]>[] = [
    {
      id: 'stt',
      header: 'STT',
      cell: ({ row }) => <div className='text-center'>{row.index + 1}</div>
    },
    { id: 'ip', accessorKey: 'ip', header: 'IP' },
    { id: 'city', accessorKey: 'city', header: 'City' },
    { id: 'region', accessorKey: 'region', header: 'Region' },
    { id: 'country', accessorKey: 'country', header: 'Country' },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: 'Time',
      cell: ({ cell }) =>
        format(new Date(cell.getValue<string>()), 'HH:mm:ss  dd/MM/yyyy')
    }
  ];

  return (
    <div className='h-[calc(100vh-48px)] space-y-6 overflow-y-auto p-4'>
      {/* KPIs: Total views and Top 5 pages */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Total views */}
        <Card>
          <CardHeader>
            <CardTitle>Tổng số lượt xem</CardTitle>
          </CardHeader>
          <CardContent>
            {isDashboardLoading ? (
              <div className='space-y-4'>
                <div className='flex items-end gap-4'>
                  <Skeleton className='h-10 w-40' />
                  <Skeleton className='mb-1 h-4 w-24' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-48' />
                  <Skeleton className='h-2 w-full' />
                  <Skeleton className='h-2 w-2/3' />
                </div>
              </div>
            ) : (
              <>
                <div className='flex items-end gap-4'>
                  <div className='text-4xl font-bold md:text-5xl'>
                    {totalViews.toLocaleString()}
                  </div>
                  <div className='text-muted-foreground mb-1'>
                    toàn hệ thống
                  </div>
                </div>
                <div className='mt-6 space-y-3'>
                  <div className='text-muted-foreground text-sm'>
                    Số trang theo dõi:{' '}
                    <span className='text-foreground font-medium'>
                      {pagesCount}
                    </span>
                  </div>
                  {topKpi && (
                    <div className='space-y-1'>
                      <div className='flex items-center justify-between text-sm'>
                        <div className='min-w-0'>
                          Trang top:{' '}
                          <span className='font-medium'>
                            {getPageLabel(topKpi.page)}
                          </span>
                        </div>
                        <span className='tabular-nums'>
                          {topKpi.total.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={topShare} />
                      <div className='text-muted-foreground text-xs'>
                        Chiếm {topShare}% tổng
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Top 5 pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 trang được xem nhiều nhất</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {isDashboardLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className='space-y-1'>
                  <div className='flex items-center justify-between gap-3'>
                    <div className='flex min-w-0 items-center gap-2'>
                      <Skeleton className='h-6 w-6 rounded-full' />
                      <Skeleton className='h-4 w-40' />
                    </div>
                    <Skeleton className='h-3 w-10' />
                  </div>
                  <Skeleton className='h-2 w-full' />
                </div>
              ))
            ) : (
              <>
                {(dashboardData || [])
                  .slice()
                  .sort((a, b) => b.total - a.total)
                  .slice(0, 5)
                  .map((p, idx, arr) => {
                    const max = Math.max(1, ...arr.map((it) => it.total));
                    const name = getPageLabel(p.page);
                    return (
                      <div key={p.page} className='space-y-1'>
                        <div className='flex items-center justify-between gap-3'>
                          <div className='flex min-w-0 items-center gap-2'>
                            <span className='bg-muted text-foreground/80 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium'>
                              {idx + 1}
                            </span>
                            <span className='line-clamp-1 text-sm'>{name}</span>
                          </div>
                          <span className='text-muted-foreground text-xs tabular-nums'>
                            {p.total}
                          </span>
                        </div>
                        <Progress value={(p.total / max) * 100} />
                      </div>
                    );
                  })}
                {(!dashboardData || dashboardData.length === 0) && (
                  <div className='text-muted-foreground text-sm'>
                    Không có dữ liệu
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
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
            <BarChart
              data={topPages}
              margin={{ left: 12, right: 12, bottom: 32 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='name'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={0}
                tick={<TwoLineXAxisTick />}
              />
              <ChartTooltip
                cursor={{ fill: 'var(--primary)', opacity: 0.1 }}
                content={<ChartTooltipContent />}
              />
              <Bar
                dataKey='total'
                fill='var(--primary)'
                radius={[4, 4, 0, 0]}
                cursor='pointer'
                onClick={(_, index) => {
                  const item = (topPages as any[])[index];
                  if (item?.page) {
                    setSelectedPage(item.page);
                    setSelectedDetailId(null);
                    pageHistoryRef.current?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                }}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      {/* Details sections - vertical bar charts with full labels */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
        {[
          { key: ViewPage.PRODUCT_DETAIL, title: 'Lượt xem chi tiết sản phẩm' },
          { key: ViewPage.BLOGS_DETAIL, title: 'Lượt xem chi tiết blog' },
          {
            key: ViewPage.DOCUMENTATION_DETAIL,
            title: 'Lượt xem chi tiết tài liệu'
          }
        ].map(({ key, title }) => {
          const items =
            (dashboardData || [])
              .find((p) => p.page === key)
              ?.details?.filter((p) => p.total > 0)
              ?.slice()
              .sort((a, b) => b.total - a.total)
              .slice(0, 10) || [];
          const chartData = items.map((d) => ({
            name: d.pageName || d.pageDetailId || 'Unknown',
            total: d.total,
            id: d.pageDetailId || ''
          }));
          const chartHeight = Math.min(40 + chartData.length * 28, 360);
          return (
            <Card key={key}>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    total: { label: 'Views', color: 'var(--primary)' }
                  }}
                  className='w-full'
                  style={{ height: chartHeight }}
                >
                  <BarChart
                    data={chartData}
                    layout='vertical'
                    margin={{ left: 12, right: 12 }}
                  >
                    <CartesianGrid vertical={false} />
                    <YAxis
                      type='category'
                      dataKey='name'
                      width={180}
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      tickFormatter={(value: string) =>
                        value.length > 28 ? value.slice(0, 28) + '…' : value
                      }
                    />
                    {/* Keep X axis for grid calculation but hide ticks/axis */}
                    <XAxis
                      type='number'
                      hide
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip
                      cursor={{ fill: 'var(--primary)', opacity: 0.08 }}
                      content={<ChartTooltipContent />}
                    />
                    <Bar
                      dataKey='total'
                      fill='var(--primary)'
                      radius={[0, 4, 4, 0]}
                      cursor='pointer'
                      onClick={(_, index) => {
                        const item = (chartData as any[])[index];
                        if (!item) return;
                        if (key === ViewPage.PRODUCT_DETAIL && item.id) {
                          setSelectedDetailId(item.id);
                          pageDetailRef.current?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                          });
                        } else if (key === ViewPage.BLOGS_DETAIL && item.id) {
                          setSelectedBlogDetailId(item.id);
                          blogDetailRef.current?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                          });
                        } else if (
                          key === ViewPage.DOCUMENTATION_DETAIL &&
                          item.id
                        ) {
                          setSelectedDocumentationDetailId(item.id);
                          documentationDetailRef.current?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                          });
                        }
                      }}
                    >
                      <LabelList
                        dataKey='total'
                        position='right'
                        className='text-xs'
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {/* History section with tabs */}
      <Card ref={pageHistoryRef}>
        <CardHeader>
          <CardTitle>Lịch sử truy cập trang</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <TrackingHistoryTable
            data={pageHistory || []}
            columns={historyColumns}
            isLoading={!pageHistory}
          >
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
          </TrackingHistoryTable>
        </CardContent>
      </Card>
      <Card className='p-6' ref={pageDetailRef}>
        <CardHeader className='px-0'>
          <CardTitle>Lịch sử truy cập chi tiết sản phẩm</CardTitle>
        </CardHeader>

        <TrackingHistoryTable
          data={pageDetailHistory || []}
          columns={historyColumns}
          isLoading={!pageDetailHistory}
        >
          {' '}
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
        </TrackingHistoryTable>
      </Card>
      <Card className='p-6' ref={blogDetailRef}>
        <CardHeader className='px-0'>
          <CardTitle>Lịch sử truy cập chi tiết blog</CardTitle>
        </CardHeader>

        <TrackingHistoryTable
          data={blogDetailHistory || []}
          columns={historyColumns}
          isLoading={!blogDetailHistory}
        >
          {' '}
          <Select
            value={selectedBlogDetailId || ''}
            onValueChange={(v) => setSelectedBlogDetailId(v)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Chọn trang chi tiết (tuỳ chọn)' />
            </SelectTrigger>
            <SelectContent>
              {blogDetailOptions.map((opt, index) => (
                <SelectItem key={index} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>{' '}
        </TrackingHistoryTable>
      </Card>
      <Card className='p-6' ref={documentationDetailRef}>
        <CardHeader className='px-0'>
          <CardTitle>Lịch sử truy cập chi tiết tài liệu</CardTitle>
        </CardHeader>

        <TrackingHistoryTable
          data={documentationDetailHistory || []}
          columns={historyColumns}
          isLoading={!documentationDetailHistory}
        >
          <Select
            value={selectedDocumentationDetailId || ''}
            onValueChange={(v) => setSelectedDocumentationDetailId(v)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Chọn trang chi tiết (tuỳ chọn)' />
            </SelectTrigger>
            <SelectContent>
              {documentationDetailOptions.map((opt, index) => (
                <SelectItem key={index} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TrackingHistoryTable>
      </Card>
    </div>
  );
}

// Lightweight wrapper to reuse existing table infra without routing pagination for now
import { useDataTable } from '@/hooks/use-data-table';
import { format } from 'date-fns';
function TrackingHistoryTable({
  data,
  columns,
  children,
  isLoading
}: {
  data: PageHistory;
  columns: ColumnDef<PageHistory[number]>[];
  children?: React.ReactNode;
  isLoading?: boolean;
}) {
  const { table } = useDataTable({ data, columns, pageCount: 1 });
  return (
    <div className='h-[520px]'>
      <DataTable table={table} isLoading={isLoading}>
        <div className='flex'>
          {children}
          <DataTableToolbar table={table} />
        </div>
      </DataTable>
    </div>
  );
}
