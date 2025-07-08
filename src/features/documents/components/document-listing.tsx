'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetDocumentsQuery } from '@/lib/api/documents';
import { AlertCircle } from 'lucide-react';
import { DocumentTable } from './document-tables';
import { columns } from './document-tables/columns';
import { useSearchParams } from 'next/navigation';
import {
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_DEFAULT_PER_PAGE
} from '@/constants/pagination';
import { ColumnDef } from '@tanstack/react-table';

export default function DocumentListingPage() {
  const searchParams = useSearchParams();
  const page = parseInt(
    searchParams.get('page') || PAGINATION_DEFAULT_PAGE.toString()
  );
  const pageLimit = parseInt(
    searchParams.get('perPage') || PAGINATION_DEFAULT_PER_PAGE.toString()
  );
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  // Use RTK Query hook with pagination and filter params
  const {
    data: documentData,
    isLoading,
    error
  } = useGetDocumentsQuery({
    page,
    perPage: pageLimit,
    search,
    category
  });
  const documents = documentData?.documents || [];
  const totalItems = documentData?.total_documents || 0;

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
    <DocumentTable
      data={documents}
      totalItems={totalItems}
      columns={columns}
      page={page}
      perPage={pageLimit}
    />
  );
}
