'use client';

import { useGetProductsQuery, Product } from '@/lib/api/products';
import { ProductTable } from './product-tables';
import { columns } from './product-tables/columns';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

type ProductListingPageProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default function ProductListingPage({
  searchParams
}: ProductListingPageProps) {
  const page = Number(searchParams?.page || '1');
  const pageLimit = 20;
  const search = searchParams?.name as string;
  const categories = searchParams?.category as string;

  // Use RTK Query hook
  const { data: productData, isLoading, error } = useGetProductsQuery();
  const products = productData?.products || [];

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

  // Filter products based on search params
  let filteredProducts = products || [];

  if (categories) {
    filteredProducts = filteredProducts.filter(
      (product: Product) => product.category === categories
    );
  }

  // Pagination
  const startIndex = (page - 1) * pageLimit;
  const endIndex = startIndex + pageLimit;
  const paginatedProducts = filteredProducts?.slice(startIndex, endIndex);

  return (
    <ProductTable
      data={paginatedProducts}
      totalItems={filteredProducts?.length || 0}
      columns={columns as ColumnDef<Product>[]}
      page={page}
      perPage={pageLimit}
    />
  );
}
