'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { TwoLineXAxisTick } from './utils';

type TopPageItem = { name: string; total: number; page: string };

export function MainBarChart({
  data,
  onClick
}: {
  data: TopPageItem[];
  onClick?: (item: TopPageItem, index: number) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lượt truy cập</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ total: { label: 'Views', color: 'var(--primary)' } }}
          className='h-[300px] w-full'
        >
          <BarChart data={data} margin={{ left: 12, right: 12, bottom: 32 }}>
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
              onClick={(entry, index) =>
                onClick?.((entry?.payload as TopPageItem)!, index)
              }
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
