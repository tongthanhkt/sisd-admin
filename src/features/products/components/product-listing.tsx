'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_DEFAULT_PER_PAGE
} from '@/constants/pagination';
import { Product, useGetProductsQuery } from '@/lib/api/products';
import { ColumnDef } from '@tanstack/react-table';
import { AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { ProductTable } from './product-tables';
import { columns } from './product-tables/columns';
import { useMemo } from 'react';

export default function ProductListingPage() {
  const searchParams = useSearchParams();
  const page = parseInt(
    searchParams.get('page') || PAGINATION_DEFAULT_PAGE.toString()
  );
  const pageLimit = parseInt(
    searchParams.get('perPage') || PAGINATION_DEFAULT_PER_PAGE.toString()
  );
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  const sortParam = searchParams.get('sort');
  const sort = useMemo(() => {
    try {
      return sortParam
        ? JSON.parse(sortParam)
        : [{ id: 'createdAt', desc: true }];
    } catch {
      return [{ id: 'createdAt', desc: true }];
    }
  }, [sortParam]);

  const sortBy = sort[0]?.id || 'createdAt';
  const sortOrder = sort[0]?.asc ? 'asc' : 'desc';

  // Use RTK Query hook
  const {
    data: productData,
    isLoading,
    error
  } = useGetProductsQuery({
    page,
    perPage: pageLimit,
    search,
    category,
    sortBy,
    sortOrder
  });
  const products = productData?.products || [];
  const totalItems = productData?.total_products || 0;

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-8 w-40' />
        <Skeleton className='h-64 w-full' />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription>
          Failed to load products. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ProductTable
      data={products}
      totalItems={totalItems}
      columns={columns as ColumnDef<Product>[]}
      page={page}
      perPage={pageLimit}
    />
  );
}
