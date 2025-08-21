'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// charts moved to shared components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
// Progress and Skeleton are used inside shared KPI components
import { PAGE_NAME, ViewPage } from '@/constants/tracking';
import {
  useDashboardQuery,
  usePageDetailHistoryQuery,
  usePageHistoryQuery
} from '@/lib/api/tracking';
import { useEffect, useMemo, useRef, useState } from 'react';
// recharts primitives are used inside shared chart components

import { PageHistory } from '@/types';
import { skipToken } from '@reduxjs/toolkit/query';
import { ColumnDef } from '@tanstack/react-table';
import {
  TotalViewsKpi,
  Top5PagesKpi
} from '@/features/tracking/components/Kpis';
import { DetailBarChart } from '@/features/tracking/components/DetailBarChart';
import { MainBarChart } from '@/features/tracking/components/MainBarChart';
// import { TwoLineXAxisTick } from '@/features/tracking/components/utils';

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
  // legacy local axis tick removed; using shared utils in MainBarChart

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
        <TotalViewsKpi
          isLoading={isDashboardLoading}
          totalViews={totalViews}
          pagesCount={pagesCount}
          topPage={
            topKpi
              ? {
                  page: topKpi.page,
                  total: topKpi.total,
                  label: getPageLabel(topKpi.page)
                }
              : undefined
          }
          topShare={topShare}
        />
        <Top5PagesKpi
          isLoading={isDashboardLoading}
          items={(dashboardData || [])
            .slice()
            .sort((a, b) => b.total - a.total)
            .slice(0, 5)
            .map((p) => ({
              page: p.page,
              total: p.total,
              label: getPageLabel(p.page)
            }))}
        />
      </div>
      {/* Overall views summary */}
      <MainBarChart
        data={topPages}
        onClick={(item) => {
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
          // height handled in DetailBarChart
          return (
            <DetailBarChart
              key={key}
              title={title}
              data={chartData}
              onClick={(item) => {
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
                } else if (key === ViewPage.DOCUMENTATION_DETAIL && item.id) {
                  setSelectedDocumentationDetailId(item.id);
                  documentationDetailRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  });
                }
              }}
            />
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
