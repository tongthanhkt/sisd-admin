'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useBlogForm } from '../hooks/useBlogForm';
import { type BlogFormValues } from '../utils/form-schema';
import { BlogAdditionalInfo } from './BlogAdditionalInfo';
import { BlogDescriptions } from './BlogDescriptions';
import { BlogImages } from './BlogImages';
import { BlogSummary } from './BlogSummary';
import { PathInfo } from './PathInfo';
import { RelatedBlogs } from './RelatedBlogs';
import { RelatedProducts } from './RelatedProducts';
import { TitleBlog } from './TitleBlog';
import { ArticleSection } from './ArticleSection';
import Spinner, { SpinnerOverlay } from '@/components/ui/spinner';

interface BlogFormProps {
  blogId?: string;
  initialData?: Partial<BlogFormValues>;
  pageTitle?: string;
}

export function BlogForm({ pageTitle, blogId }: BlogFormProps) {
  const { form, onSubmit, isLoading } = useBlogForm(blogId);

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle || (blogId ? 'Edit Blog Post' : 'Create New Post')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <TitleBlog />
            <BlogImages />
            <BlogDescriptions />
            <PathInfo />
            <BlogAdditionalInfo />
            <ArticleSection />
            <RelatedProducts />
            <RelatedBlogs />
            <BlogSummary />
            <Button type='submit'>{blogId ? 'Update' : 'Create'}</Button>
          </form>
        </Form>
      </CardContent>
      {isLoading && <SpinnerOverlay />}
    </Card>
  );
}
