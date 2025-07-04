'use client';

import { useGetBlogsQuery } from '@/lib/api/blogs';
import { IBlog } from '@/models/Blog';
import { useFormContext } from 'react-hook-form';
import { BlogFormValues } from '../../utils/form-schema';
import { RelatedItem, RelatedSections } from '../RelatedSections';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_DEFAULT_PER_PAGE
} from '@/constants/pagination';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { BLOG_CATEGORIES_LABELS } from '@/constants/blog';
import { Badge } from '@/components/ui/badge';

export function RelatedBlogs({
  fieldName,
  label
}: {
  fieldName: keyof BlogFormValues;
  label: string;
}) {
  const methods = useFormContext<BlogFormValues>();
  const {
    watch,
    setValue,
    formState: { errors }
  } = methods;
  const relatedBlogs = (watch(fieldName) as string[]) || [];

  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(PAGINATION_DEFAULT_PAGE);
  const [itemsPerPage] = useState(PAGINATION_DEFAULT_PER_PAGE);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [inputValue, setInputValue] = useState(
    searchParams.get('search') || ''
  );
  const debouncedInput = useDebounce(inputValue, 500);

  // Sync search state with query params
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setInputValue(searchParams.get('search') || '');
  }, [searchParams]);

  // Debounce search input and update query params
  useEffect(() => {
    setSearch(debouncedInput);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (debouncedInput) params.set('search', debouncedInput);
    else params.delete('search');
    router.replace(`?${params.toString()}`);
  }, [debouncedInput]);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
  };

  const { data: blogData } = useGetBlogsQuery({
    page: currentPage,
    perPage: itemsPerPage,
    search
  });
  const blogs = blogData?.blogs || [];
  const totalItems = blogData?.total_blogs || 0;

  const validBlogs: RelatedItem[] = blogs
    .filter(
      (item): item is IBlog => typeof item.id === 'string' && item.id.length > 0
    )
    .map((item) => ({
      id: item.id,
      name: item.title,
      image: item.image || item.thumbnail || item.imageSrc || '',
      category: (
        <div className='flex flex-wrap gap-2'>
          {item?.categories?.map((c) => (
            <Badge key={c} variant='outline' className='capitalize'>
              {BLOG_CATEGORIES_LABELS[c]}
            </Badge>
          ))}
        </div>
      )
    }));

  return (
    <RelatedSections
      items={validBlogs}
      value={relatedBlogs}
      onChange={(ids) => setValue(fieldName, ids)}
      label={label}
      addButtonText={`Add ${label}`}
      itemLabel={(item) => item.name || ''}
      itemImage={(item) => item.image || ''}
      fieldName={fieldName}
      helperText={errors[fieldName]?.message}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={totalItems}
      onPageChange={setCurrentPage}
      search={inputValue}
      onSearchChange={handleSearchChange}
      maxSelected={4}
    />
  );
}
