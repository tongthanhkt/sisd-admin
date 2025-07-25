'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetStoneCatalogsQuery } from '@/lib/api/catalog';
import { AlertCircle } from 'lucide-react';
import { CatalogTable } from './catalog-tables';
import { columns } from './catalog-tables/columns';

export default function CatalogListingPage() {
  // Use RTK Query hook with pagination and filter params
  const { data: catalogs, isLoading, error } = useGetStoneCatalogsQuery();

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

  return <CatalogTable data={catalogs || []} columns={columns} perPage={10} />;
}
