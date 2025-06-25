'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { blogFormSchema, type BlogFormValues } from '../utils/form-schema';
import { Switch } from '@/components/ui/switch';
import { FileUploader } from '@/components/file-uploader';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

interface BlogFormProps {
  blogId?: string;
  initialData?: Partial<BlogFormValues>;
  pageTitle?: string;
}

// Thêm các helper component nhỏ cho mảng động
function ArrayInput({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className='space-y-2'>
      <div className='mb-1 font-medium'>{label}</div>
      {(value || []).map((item, idx) => (
        <div key={idx} className='flex gap-2'>
          <Input
            placeholder={
              placeholder ? `${placeholder} ${idx + 1}` : `Item ${idx + 1}`
            }
            value={item}
            onChange={(e) => {
              const newValue = [...(value || [])];
              newValue[idx] = e.target.value;
              onChange(newValue);
            }}
          />
          <Button
            type='button'
            variant='destructive'
            onClick={() => {
              const newValue = (value || []).filter((_, i) => i !== idx);
              onChange(newValue);
            }}
          >
            Xóa
          </Button>
        </div>
      ))}
      <Button
        type='button'
        onClick={() => {
          onChange([...(value || []), '']);
        }}
      >
        Thêm
      </Button>
    </div>
  );
}

function RelatedPostsInput({
  value,
  onChange
}: {
  value: any[];
  onChange: (v: any[]) => void;
}) {
  return (
    <div className='space-y-2'>
      <div className='mb-1 font-medium'>Bài viết liên quan</div>
      {(value || []).map((item, idx) => (
        <div
          key={idx}
          className='mb-2 flex flex-col gap-2 rounded-md border p-2'
        >
          <Input
            placeholder='Tiêu đề'
            value={item.title || ''}
            onChange={(e) => {
              const newValue = [...value];
              newValue[idx] = { ...newValue[idx], title: e.target.value };
              onChange(newValue);
            }}
          />
          <Input
            placeholder='Danh mục'
            value={item.category || ''}
            onChange={(e) => {
              const newValue = [...value];
              newValue[idx] = { ...newValue[idx], category: e.target.value };
              onChange(newValue);
            }}
          />
          <Input
            placeholder='Slug'
            value={item.slug || ''}
            onChange={(e) => {
              const newValue = [...value];
              newValue[idx] = { ...newValue[idx], slug: e.target.value };
              onChange(newValue);
            }}
          />
          <Button
            type='button'
            variant='destructive'
            onClick={() => {
              const newValue = value.filter((_, i) => i !== idx);
              onChange(newValue);
            }}
          >
            Xóa bài viết
          </Button>
        </div>
      ))}
      <Button
        type='button'
        onClick={() => {
          onChange([...(value || []), { title: '', category: '', slug: '' }]);
        }}
      >
        Thêm bài viết
      </Button>
    </div>
  );
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
    date: initialData?.date
      ? new Date(initialData.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
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
    isVertical: initialData?.isVertical ?? false
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
            {/* Ảnh đại diện */}
            <FormField
              control={form.control}
              name='imageSrc'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Ảnh đại diện</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={uploadedFiles}
                      onValueChange={async (files) => {
                        if (files && (files as File[]).length > 0) {
                          const fileArr = files as File[];
                          setUploadedFiles(fileArr);
                          // Giả lập upload, chỉ lấy url local
                          const file = fileArr[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            setPreviewUrl(url);
                            field.onChange(url);
                          }
                        }
                      }}
                      maxFiles={1}
                      maxSize={4 * 1024 * 1024}
                      multiple={false}
                    />
                  </FormControl>
                  {previewUrl && (
                    <div className='mt-4'>
                      <p className='text-muted-foreground mb-2 text-sm'>
                        Preview:
                      </p>
                      <ScrollArea className='h-fit w-full'>
                        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
                          <div className='relative aspect-square'>
                            <Image
                              src={previewUrl}
                              alt='Preview'
                              fill
                              className='rounded-md object-cover'
                            />
                          </div>
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input placeholder='Nhập tiêu đề bài viết' {...field} />
                    </FormControl>
                    <FormMessage />
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
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danh mục</FormLabel>
                    <FormControl>
                      <Input placeholder='Nhập danh mục' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='categoryColor'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Màu danh mục</FormLabel>
                    <FormControl>
                      <Input type='color' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Nhập mô tả bài viết' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nội dung</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Nhập nội dung bài viết' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Trường mảng: categories */}
            <FormField
              control={form.control}
              name='categories'
              render={({ field }) => (
                <FormItem>
                  <ArrayInput
                    label='Danh mục phụ'
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder='Danh mục'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Trường boolean */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='isOustanding'
                render={({ field }) => (
                  <FormItem className='flex items-center gap-2'>
                    <FormLabel>Bài viết nổi bật</FormLabel>
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
                name='showArrowDesktop'
                render={({ field }) => (
                  <FormItem className='flex items-center gap-2'>
                    <FormLabel>Hiện mũi tên desktop</FormLabel>
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
                  <FormItem className='flex items-center gap-2'>
                    <FormLabel>Hiển thị dọc</FormLabel>
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
            {/* Trường mảng: relatedProducts */}
            <FormField
              control={form.control}
              name='relatedProducts'
              render={({ field }) => (
                <FormItem>
                  <ArrayInput
                    label='Sản phẩm liên quan'
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder='Sản phẩm'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Trường động: relatedPosts */}
            <FormField
              control={form.control}
              name='relatedPosts'
              render={({ field }) => (
                <FormItem>
                  <RelatedPostsInput
                    value={field.value || []}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={loading}>
              {loading ? 'Đang xử lý...' : blogId ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
