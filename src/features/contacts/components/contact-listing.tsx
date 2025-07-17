'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetContactsQuery } from '@/lib/api/contacts';
import { AlertCircle } from 'lucide-react';
import { ContactTable } from './contact-tables';
import { columns } from './contact-tables/columns';
import { useSearchParams } from 'next/navigation';
import {
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_DEFAULT_PER_PAGE
} from '@/constants/pagination';
import { useMemo } from 'react';

export default function ContactListing() {
  const searchParams = useSearchParams();
  const page = parseInt(
    searchParams.get('page') || PAGINATION_DEFAULT_PAGE.toString()
  );
  const pageLimit = parseInt(
    searchParams.get('perPage') || PAGINATION_DEFAULT_PER_PAGE.toString()
  );
  const search = searchParams.get('search') || '';

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
  const sortOrder = sort[0]?.desc ? 'desc' : 'asc';

  const {
    data: contactData,
    isLoading,
    error
  } = useGetContactsQuery({
    page,
    perPage: pageLimit,
    search,
    sortBy,
    sortOrder
  });
  const contacts = contactData?.contacts || [];
  const totalItems = contactData?.total_contacts || 0;

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
    <ContactTable
      data={contacts}
      totalItems={totalItems}
      columns={columns}
      page={page}
      perPage={pageLimit}
    />
  );
}
