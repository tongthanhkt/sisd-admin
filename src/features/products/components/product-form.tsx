'use client';

import { UploadImage } from '@/components';
import { UploadMultipleIImage } from '@/components/UploadMultipleIImage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { productFormSchema } from '@/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';
import { RelatedBlogs } from './RelatedBlogs';
import { RelatedProducts } from './RelatedProducts';
import { SortableListField } from './SortableListField';
import { TechnicalSpecifications } from './TechnicalSpecifications.tsx';

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type FieldName = keyof ProductFormValues;

export default function ProductForm({
  initialData,
  pageTitle
}: {
  initialData: Product | null;
  pageTitle: string;
}) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedMultipleFiles, setUploadedMultipleFiles] = useState<File[]>(
    []
  );

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
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
      setUploadedFiles([]);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu sản phẩm!');
    }
  };

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
                      if (files) {
                        setUploadedFiles(files);
                        field.onChange(files);
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
