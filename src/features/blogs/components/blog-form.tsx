'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useBlogForm } from '../hooks/useBlogForm';
import { type BlogFormValues } from '../utils/form-schema';
import { BlogAdditionalInfo } from './BlogAdditionalInfo';
import { BlogDescriptions } from './BlogDescriptions';
import { BlogImages } from './BlogImages';
import { PathInfo } from './PathInfo';
import { RelatedBlogs } from './RelatedBlogs';
import { RelatedProducts } from './RelatedProducts';
import { TitleBlog } from './TitleBlog';

interface BlogFormProps {
  blogId?: string;
  initialData?: Partial<BlogFormValues>;
  pageTitle?: string;
}

export function BlogForm({ initialData, pageTitle, blogId }: BlogFormProps) {
  const { form, onSubmit } = useBlogForm(blogId);

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

            {/* TODO: Add article sections */}

            <RelatedProducts />
            <RelatedBlogs />

            <div className='grid grid-cols-1 gap-6'>
              <FormField
                control={form.control}
                name='summary'
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        label='Summary'
                        placeholder='Enter summary'
                        className='resize-none'
                        {...field}
                        error={!!error}
                        helperText={error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='contact'
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder='Enter contact'
                        className='resize-none'
                        {...field}
                        label='Contact'
                        error={!!error}
                        helperText={error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button type='submit'>{blogId ? 'Update' : 'Create'}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
