'use client';

import { UploadImage } from '@/components';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Product } from '@/constants/data';
import { productCategories } from '@/constants/products';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconX } from '@tabler/icons-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';
import { SortableListField } from './SortableListField';
import { TechnicalSpecifications } from './TechnicalSpecifications.tsx';
import { UploadMultipleIImage } from '@/components/UploadMultipleIImage';
import { Checkbox } from '@/components/ui/checkbox';
import { RelatedProducts } from './RelatedProducts';
import { RelatedBlogs } from './RelatedBlogs';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

const formSchema = z.object({
  code: z.string().optional(),
  href: z.string().optional(),
  name: z.string().optional(),
  category: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  images: z.object({
    main: z.string().optional(),
    thumbnails: z.array(z.string()).optional()
  }),
  packaging: z.string().optional(),
  advantages: z
    .array(
      z.object({
        id: z.string(),
        value: z.string()
      })
    )
    .optional(),
  technicalSpecifications: z.object({
    standard: z.string().optional(),
    specifications: z
      .array(
        z.object({
          stt: z.number().optional(),
          category: z.string().optional(),
          performance: z.string().optional()
        })
      )
      .optional()
  }),
  transportationAndStorage: z
    .array(
      z.object({
        id: z.string(),
        value: z.string()
      })
    )
    .optional(),
  safetyRegulations: z.object({
    standard: z.string().optional(),
    specifications: z
      .array(
        z.object({
          stt: z.number().optional(),
          performance: z.string().optional()
        })
      )
      .optional(),
    warning: z.string().optional(),
    notes: z.string().optional()
  }),
  isFeatured: z.boolean().optional()
});

export type ProductFormValues = z.infer<typeof formSchema>;
export type FieldName = keyof ProductFormValues;

interface FileCardProps {
  imageUrl: string;
  onRemove: () => void;
}

function FileCard({ imageUrl, onRemove }: FileCardProps) {
  return (
    <div className='relative flex items-center space-x-4 rounded-lg border p-4'>
      <div className='relative h-16 w-16 overflow-hidden rounded-md'>
        <Image
          src={imageUrl}
          alt='Product image'
          fill
          className='object-cover'
          sizes='64px'
        />
      </div>
      <Button
        variant='ghost'
        size='icon'
        className='absolute top-2 right-2 h-8 w-8'
        onClick={onRemove}
      >
        <IconX className='h-4 w-4' />
      </Button>
    </div>
  );
}

export default function ProductForm({
  initialData,
  pageTitle
}: {
  initialData: Product | null;
  pageTitle: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedMultipleFiles, setUploadedMultipleFiles] = useState<File[]>(
    []
  );
  const [previewUrls, setPreviewUrls] = useState<{ id: string; url: string }[]>(
    []
  );

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: initialData?.code || '',
      name: initialData?.name || '',
      category: initialData?.category || 'MORTAL',
      shortDescription: initialData?.shortDescription || '',
      description: initialData?.description || '',
      image: initialData?.image || '',
      images: {
        main: initialData?.images?.main || '',
        thumbnails: initialData?.images?.thumbnails || []
      },
      packaging: initialData?.packaging || '',
      advantages: initialData?.advantages || [],
      technicalSpecifications: initialData?.technicalSpecifications || {
        standard: '',
        specifications: []
      },
      transportationAndStorage: initialData?.transportationAndStorage || [],
      safetyRegulations: initialData?.safetyRegulations || {
        standard: '',
        specifications: []
      },
      isFeatured: initialData?.isFeatured || false
    }
  });

  const onSubmit = async (values: ProductFormValues) => {
    try {
      setIsLoading(true);
      const payload = {
        ...values,
        image: values.image,
        images: {
          thumbnails: values.images.thumbnails
        },
        technicalSpecifications: values.technicalSpecifications,
        transportationAndStorage: values.transportationAndStorage,
        safetyRegulations: values.safetyRegulations
      };

      let response;
      if (initialData && initialData.id) {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${initialData.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }
        );
      } else {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        throw new Error('Lưu sản phẩm thất bại!');
      }
      toast.success('Lưu sản phẩm thành công!');
      form.reset();
      setPreviewUrls([]);
      setUploadedFiles([]);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu sản phẩm!');
    } finally {
      setIsLoading(false);
    }
  };

  // Set mounted to true after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize preview URLs with existing images
  React.useEffect(() => {
    if (mounted && initialData?.images?.thumbnails?.length) {
      const initialPreviews = initialData.images.thumbnails.map((url) => ({
        id: `existing-${url}`,
        url
      }));
      setPreviewUrls(initialPreviews);
    }
  }, [initialData?.images?.thumbnails, mounted]);

  // Cleanup preview URLs when component unmounts
  React.useEffect(() => {
    return () => {
      if (mounted) {
        // Only revoke URLs that were created with createObjectURL
        previewUrls.forEach(({ url }) => {
          if (url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
      }
    };
  }, [previewUrls, mounted]);

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='flex items-center gap-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter product name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='isFeatured'
                render={({ field }) => (
                  <FormItem className='mt-5 flex flex-row items-start space-y-0 space-x-1 text-neutral-700'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id='isFeatured'
                      />
                    </FormControl>
                    <label
                      htmlFor='isFeatured'
                      className='space-y-1 text-sm leading-none'
                    >
                      Mark as Featured
                    </label>
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='image'
                render={({ field }) => (
                  <UploadImage
                    value={uploadedFiles}
                    className='h-60'
                    onValueChange={async (files) => {
                      if (files && mounted) {
                        try {
                          setIsUploading(true);
                          // Update uploaded files
                          setUploadedFiles(files);

                          field.onChange(files);
                        } catch (error) {
                          console.error('Error uploading file:', error);
                        } finally {
                          setIsUploading(false);
                        }
                      }
                    }}
                    maxFiles={1}
                    maxSize={4 * 1024 * 1024}
                  />
                )}
              />

              <UploadMultipleIImage
                value={uploadedMultipleFiles}
                onValueChange={setUploadedMultipleFiles}
              />
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Code</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter product code' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='href'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Href</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter href'
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select categories' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {productCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='packaging'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Packaging</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter packaging information'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 gap-6'>
              <FormField
                control={form.control}
                name='shortDescription'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter short description'
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter product description'
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SortableListField
              fieldName='advantages'
              title='Advantages'
              addButtonText='Add Advantage'
              placeholder='Enter advantage'
            />

            <TechnicalSpecifications />

            <SortableListField
              fieldName='transportationAndStorage'
              title='Transportation and Storage'
              addButtonText='Add Rule'
              placeholder='Enter rule'
            />

            <FormField
              control={form.control}
              name='safetyRegulations'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Safety Regulations</FormLabel>
                  <FormControl>
                    <div className='space-y-4'>
                      <Textarea
                        placeholder='Warning'
                        value={field.value?.warning || ''}
                        onChange={(e) => {
                          field.onChange({
                            ...field.value,
                            warning: e.target.value
                          });
                        }}
                      />
                      <Textarea
                        placeholder='Notes (optional)'
                        value={field.value?.notes || ''}
                        onChange={(e) => {
                          field.onChange({
                            ...field.value,
                            notes: e.target.value
                          });
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <RelatedProducts />
            <RelatedBlogs />

            <Button>Save Product</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
