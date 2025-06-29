'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetBlogsQuery } from '@/lib/api/blogs';
import { AlertCircle } from 'lucide-react';
import { BlogTable } from './blog-tables';
import { columns } from './blog-tables/columns';

type BlogListingPage = {};

export default function BlogListingPage({}: BlogListingPage) {
  const page = 1;
  const pageLimit = 10;

  // Use RTK Query hook
  const { data: blogData, isLoading, error } = useGetBlogsQuery();
  const blogs = blogData?.blogs || [];
  console.log('🚀 ~ BlogListingPage ~ blogs:', blogs);

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

  // Filter blogs based on search params
  let filteredBlogs = blogs || [];

  // Pagination
  const startIndex = (page - 1) * pageLimit;
  const endIndex = startIndex + pageLimit;
  const paginatedBlogs = filteredBlogs?.slice(startIndex, endIndex);

  return (
    <BlogTable
      data={paginatedBlogs}
      totalItems={filteredBlogs?.length || 0}
      columns={columns}
      page={page}
      perPage={pageLimit}
    />
  );
}
