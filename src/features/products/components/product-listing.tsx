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

export default function ProductListingPage() {
  const searchParams = useSearchParams();
  const page = parseInt(
    searchParams.get('page') || PAGINATION_DEFAULT_PAGE.toString()
  );
  const pageLimit = parseInt(
    searchParams.get('perPage') || PAGINATION_DEFAULT_PER_PAGE.toString()
  );
  const search = searchParams.get('search') || '';
  // Use RTK Query hook
  const {
    data: productData,
    isLoading,
    error
  } = useGetProductsQuery({
    page,
    perPage: pageLimit,
    search
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
