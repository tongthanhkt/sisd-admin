'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField } from '@/components/ui/form';

import { AppSelect, UploadImage } from '@/components';
import { useFloorProduct } from '../hooks/useFloorProduct';
import { FloorProductFormValues } from '../utils/form-schema';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useGetStoneCatalogsQuery } from '@/lib/api/catalog';

interface BlogFormProps {
  productId?: string;
  initialData?: Partial<FloorProductFormValues>;
  pageTitle?: string;
}

export function FloorProductForm({ pageTitle, productId }: BlogFormProps) {
  const { methods, onSubmit } = useFloorProduct({ productId });
  const { control } = methods;

  const { data: catalogs } = useGetStoneCatalogsQuery();
  const catalogOptions =
    catalogs?.map((catalog) => ({
      label: catalog.code,
      value: catalog.id
    })) || [];

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle ||
            (productId ? 'Edit Floor Product' : 'Create New Floor Product')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...methods}>
          <form onSubmit={onSubmit} className='space-y-8'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={control}
                name='image_url'
                render={({ field }) => (
                  <UploadImage
                    {...field}
                    className='h-60'
                    onValueChange={async (files) => {
                      if (files) {
                        field.onChange(files);
                      }
                    }}
                    maxFiles={1}
                    maxSize={10 * 1024 * 1024}
                    required
                    label='Image'
                  />
                )}
              />{' '}
              <FormField
                control={control}
                name='color_image_url'
                render={({ field }) => (
                  <UploadImage
                    {...field}
                    className='h-60'
                    onValueChange={async (files) => {
                      if (files) {
                        field.onChange(files);
                      }
                    }}
                    maxFiles={1}
                    maxSize={10 * 1024 * 1024}
                    required
                    label='Color Image'
                  />
                )}
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={control}
                name='color_name'
                render={({ field }) => <Input {...field} label='Color Name' />}
              />
              <FormField
                control={control}
                name='catalog_id'
                render={({ field }) => (
                  <AppSelect
                    onChange={field.onChange}
                    value={field.value}
                    label='Catalog'
                    options={catalogOptions}
                    placeholder='Select Catalog'
                    required
                  />
                )}
              />
            </div>
            <FormField
              control={control}
              name='content'
              render={({ field }) => <Textarea {...field} label='Content' />}
            />

            <Button type='submit'>{productId ? 'Update' : 'Create'}</Button>
          </form>
        </Form>
      </CardContent>
      {/* {isLoading && <SpinnerOverlay />} */}
    </Card>
  );
}
