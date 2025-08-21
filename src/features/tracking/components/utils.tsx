'use client';

import React from 'react';

// X-axis tick that wraps long labels into at most 2 lines
export const TwoLineXAxisTick = ({ x, y, payload, maxChars = 16 }: any) => {
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

// Y-axis tick that wraps long labels into at most 2 lines and aligns right
export const TwoLineYAxisTick = ({ x, y, payload, maxChars = 28 }: any) => {
  const value: string = payload?.value ?? '';
  if (!value) return null;
  let first = value;
  let second = '';
  if (value.length > maxChars) {
    const cutAt = value.lastIndexOf(' ', maxChars);
    const idx = cutAt > 10 ? cutAt : maxChars;
    first = value.slice(0, idx).trim();
    second = value.slice(idx).trim();
  }
  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor='end' fill='currentColor' className='text-[12px]'>
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
