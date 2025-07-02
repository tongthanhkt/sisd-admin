'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetBlogsQuery } from '@/lib/api/blogs';
import { AlertCircle } from 'lucide-react';
import { BlogTable } from './blog-tables';
import { columns } from './blog-tables/columns';
import { useSearchParams } from 'next/navigation';
import {
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_DEFAULT_PER_PAGE
} from '@/constants/pagination';

export default function BlogListingPage() {
  const searchParams = useSearchParams();
  const page = parseInt(
    searchParams.get('page') || PAGINATION_DEFAULT_PAGE.toString()
  );
  const pageLimit = parseInt(
    searchParams.get('perPage') || PAGINATION_DEFAULT_PER_PAGE.toString()
  );
  const search = searchParams.get('search') || '';
  const categoriesParam = searchParams.get('categories') || '';
  const categories = categoriesParam ? categoriesParam.split(',') : [];

  // Use RTK Query hook with pagination and filter params
  const {
    data: blogData,
    isLoading,
    error
  } = useGetBlogsQuery({
    page,
    perPage: pageLimit,
    search,
    categories
  });
  const blogs = blogData?.blogs || [];
  const totalItems = blogData?.total_blogs || 0;

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
          Failed to load blogs. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <BlogTable
      data={blogs}
      totalItems={totalItems}
      columns={columns}
      page={page}
      perPage={pageLimit}
    />
  );
}
