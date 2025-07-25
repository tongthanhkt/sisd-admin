'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetStoneCatalogsQuery } from '@/lib/api/catalog';
import { AlertCircle } from 'lucide-react';
import { FloorProductTable } from './floor-product-tables';
import { columns } from './floor-product-tables/columns';

export default function FloorProductListingPage() {
  // Use RTK Query hook with pagination and filter params
  const { data: catalogs, isLoading, error } = useGetStoneCatalogsQuery();
  const catalogsData = catalogs || [];
  const totalItems = catalogsData.length;

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-64 w-full' />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription>
          Failed to load documents. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <FloorProductTable
      data={catalogs?.[0]?.products || []}
      totalItems={totalItems}
      columns={columns(catalogs || [])}
      page={1}
      perPage={10}
    />
  );
}
