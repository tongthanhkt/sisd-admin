'use client';

import { useGetBlogsQuery } from '@/lib/api/blogs';
import { IBlog } from '@/models/Blog';
import { useFormContext } from 'react-hook-form';
import { BlogFormValues } from '../../utils/form-schema';
import { RelatedItem, RelatedSections } from '../RelatedSections';

export function RelatedBlogs() {
  const methods = useFormContext<BlogFormValues>();
  const {
    watch,
    setValue,
    formState: { errors }
  } = methods;
  const relatedBlogs = watch('relatedPosts');
  const { data: blogData } = useGetBlogsQuery();
  const blogs = blogData?.blogs || [];

  const validBlogs: RelatedItem[] = blogs
    .filter(
      (item): item is IBlog => typeof item.id === 'string' && item.id.length > 0
    )
    .map((item) => ({
      id: item.id,
      name: item.title,
      image: item.image || item.thumbnail || item.imageSrc || '',
      category: item.category || ''
    }));

  return (
    <RelatedSections
      items={validBlogs}
      value={relatedBlogs}
      onChange={(ids) => setValue('relatedPosts', ids)}
      label='Related Blogs'
      addButtonText='Add blog'
      itemLabel={(item) => item.name || ''}
      itemImage={(item) => item.image || ''}
      fieldName='relatedPosts'
      helperText={errors.relatedPosts?.message}
    />
  );
}
