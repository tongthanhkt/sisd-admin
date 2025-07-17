'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_DEFAULT_PER_PAGE
} from '@/constants/pagination';
import { useGetDocumentsQuery } from '@/lib/api/documents';
import { AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { DocumentTable } from './document-tables';
import { columns } from './document-tables/columns';

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
  const sortOrder =
    sort[0]?.desc !== undefined ? (sort[0]?.desc ? 'desc' : 'asc') : 'desc';

  // Use RTK Query hook with pagination and filter params
  const {
    data: documentData,
    isLoading,
    error
  } = useGetDocumentsQuery({
    page,
    perPage: pageLimit,
    search,
    category,
    sortBy,
    sortOrder
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
