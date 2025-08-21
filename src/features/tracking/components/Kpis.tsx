'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

type TopPage = { page: string; total: number; label: string };

export function TotalViewsKpi({
  isLoading,
  totalViews,
  pagesCount,
  topPage,
  topShare
}: {
  isLoading: boolean;
  totalViews: number;
  pagesCount: number;
  topPage?: TopPage;
  topShare: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tổng số lượt xem</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
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
              <div className='text-muted-foreground mb-1'>toàn hệ thống</div>
            </div>
            <div className='mt-6 space-y-3'>
              <div className='text-muted-foreground text-sm'>
                Số trang theo dõi:{' '}
                <span className='text-foreground font-medium'>
                  {pagesCount}
                </span>
              </div>
              {topPage && (
                <div className='space-y-1'>
                  <div className='flex items-center justify-between text-sm'>
                    <div className='min-w-0'>
                      Trang top:{' '}
                      <span className='font-medium'>{topPage.label}</span>
                    </div>
                    <span className='tabular-nums'>
                      {topPage.total.toLocaleString()}
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
  );
}

export function Top5PagesKpi({
  isLoading,
  items
}: {
  isLoading: boolean;
  items: TopPage[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 trang được xem nhiều nhất</CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        {isLoading
          ? Array.from({ length: 5 }).map((_, idx) => (
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
          : items.map((p, idx, arr) => {
              const max = Math.max(1, ...arr.map((it) => it.total));
              return (
                <div key={p.page} className='space-y-1'>
                  <div className='flex items-center justify-between gap-3'>
                    <div className='flex min-w-0 items-center gap-2'>
                      <span className='bg-muted text-foreground/80 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium'>
                        {idx + 1}
                      </span>
                      <span className='line-clamp-1 text-sm'>{p.label}</span>
                    </div>
                    <span className='text-muted-foreground text-xs tabular-nums'>
                      {p.total}
                    </span>
                  </div>
                  <Progress value={(p.total / max) * 100} />
                </div>
              );
            })}
      </CardContent>
    </Card>
  );
}
