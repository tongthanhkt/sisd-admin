'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { BLOG_CATEGORIES_OPTIONS } from '@/constants/blog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { blogFormSchema, type BlogFormValues } from '../utils/form-schema';
import { BlogImages } from './BlogImages';
import { RelatedBlogs } from './RelatedBlogs';
import { RelatedProducts } from './RelatedProducts';

interface BlogFormProps {
  blogId?: string;
  initialData?: Partial<BlogFormValues>;
  pageTitle?: string;
}

export function BlogForm({ initialData, pageTitle, blogId }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Chuẩn hóa initialData nếu có
  const normalizedInitialData: BlogFormValues = {
    title: initialData?.title || '',
    image: initialData?.image || '',
    content: Array.isArray(initialData?.content)
      ? initialData?.content.join('\n\n')
      : initialData?.content || '',
    description: initialData?.description || '',
    href: initialData?.href || '',
    date: initialData?.date ? new Date(initialData.date) : new Date(),
    isOustanding: initialData?.isOustanding ?? false,
    imageSrc: initialData?.imageSrc || '',
    imageAlt: initialData?.imageAlt || '',
    category: initialData?.category || '',
    categoryColor: initialData?.categoryColor || '',
    slug: initialData?.slug || '',
    categories: initialData?.categories || [],
    relatedPosts: initialData?.relatedPosts || [],
    articleSections: initialData?.articleSections || [],
    relatedProducts: initialData?.relatedProducts || [],
    showArrowDesktop: initialData?.showArrowDesktop ?? false,
    isVertical: initialData?.isVertical ?? false,
    banner: [],
    thumbnail: [],
    shortDescription: initialData?.shortDescription || '',
    summary: initialData?.summary || '',
    contact: initialData?.contact || '',
    relatedProduct: initialData?.relatedProduct || []
  };

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: normalizedInitialData
  });

  useEffect(() => {
    setPreviewUrl(initialData?.image || initialData?.imageSrc || null);
  }, [initialData]);

  const onSubmit = async (data: BlogFormValues) => {
    try {
      setLoading(true);
      if (blogId) {
        await fetch(`/api/blogs/${blogId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
      } else {
        await fetch('/api/blogs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
      }
      router.push('/dashboard/blogs');
      router.refresh();
    } catch (error) {
      console.error('Error saving blog:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle || (blogId ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='flex items-center gap-4'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter title' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='isOustanding'
                render={({ field }) => (
                  <FormItem className='mt-5 flex items-center gap-2'>
                    <FormLabel className='w-max'>Mark as Featured</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <BlogImages />
            <div className='grid grid-cols-1 gap-6'>
              <FormField
                control={form.control}
                name='shortDescription'
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        label='Short Description'
                        required
                        placeholder='Enter short description'
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
                name='description'
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder='Enter description'
                        className='resize-none'
                        {...field}
                        label='Description'
                        required
                        error={!!error}
                        helperText={error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='href'
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        label='Href'
                        required
                        placeholder='Enter href'
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
                name='slug'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder='Nhập slug' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <MultiSelect
                options={BLOG_CATEGORIES_OPTIONS}
                placeholder='Select categories'
                label='Categories'
                value={form.watch('categories')}
                onChange={(value) => {
                  form.setValue('categories', value);
                }}
              />
              <div className='flex items-center gap-4'>
                <DatePicker label='Date' />
                <FormField
                  control={form.control}
                  name='showArrowDesktop'
                  render={({ field }) => (
                    <FormItem className='mt-5 flex items-center gap-2'>
                      <FormLabel>Show Arrow Desktop</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='isVertical'
                  render={({ field }) => (
                    <FormItem className='mt-5 flex items-center gap-2'>
                      <FormLabel>Display Vertically</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
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

            <Button type='submit' disabled={loading}>
              {loading ? 'Đang xử lý...' : blogId ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
