'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_DEFAULT_PER_PAGE
} from '@/constants/pagination';
import { useGetFaqListQuery } from '@/lib/api/faq';
import { AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { FAQTable } from './faq-tables';
import { columns } from './faq-tables/columns';

export default function FAQListing() {
  const searchParams = useSearchParams();
  const page = parseInt(
    searchParams.get('page') || PAGINATION_DEFAULT_PAGE.toString()
  );
  const pageLimit = parseInt(
    searchParams.get('perPage') || PAGINATION_DEFAULT_PER_PAGE.toString()
  );

  const { data: faqList, isLoading, error } = useGetFaqListQuery();
  const totalItems = faqList?.length || 0;

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
          Failed to load contacts. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <FAQTable
      data={faqList || []}
      totalItems={totalItems}
      columns={columns}
      page={page}
      perPage={pageLimit}
    />
  );
}
