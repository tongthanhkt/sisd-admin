'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { TwoLineYAxisTick } from './utils';

type Item = { name: string; total: number; id?: string };

export function DetailBarChart({
  title,
  data,
  height = 320,
  onClick
}: {
  title: string;
  data: Item[];
  height?: number;
  onClick?: (item: Item, index: number) => void;
}) {
  const chartHeight = Math.min(40 + data.length * 28, height);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ total: { label: 'Views', color: 'var(--primary)' } }}
          className='w-full'
          style={{ height: chartHeight }}
        >
          <BarChart
            data={data}
            layout='vertical'
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              type='category'
              dataKey='name'
              width={220}
              tickLine={false}
              axisLine={false}
              interval={0}
              tickFormatter={(value: string) =>
                value.length > 45 ? value.slice(0, 45) + '…' : value
              }
            />
            <XAxis type='number' hide tickLine={false} axisLine={false} />
            <ChartTooltip
              cursor={{ fill: 'var(--primary)', opacity: 0.08 }}
              content={<ChartTooltipContent />}
            />
            <Bar
              dataKey='total'
              fill='var(--primary)'
              radius={[0, 4, 4, 0]}
              cursor={onClick ? 'pointer' : 'default'}
              onClick={(entry, index) =>
                onClick?.(entry?.payload as Item, index)
              }
            >
              <LabelList dataKey='total' position='right' className='text-xs' />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
