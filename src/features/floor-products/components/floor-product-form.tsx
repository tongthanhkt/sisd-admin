'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField } from '@/components/ui/form';

import { UploadImage } from '@/components';
import { useFloorProduct } from '../hooks/useFloorProduct';
import { FloorProductFormValues } from '../utils/form-schema';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  useCreateStoneCatalogMutation,
  useGetStoneCatalogsQuery
} from '@/lib/api/catalog';
import { SpinnerOverlay } from '@/components/ui/spinner';
import { Autocomplete } from '@/components/ui/autocomplete';
import { toast } from 'sonner';

interface BlogFormProps {
  productId?: string;
  initialData?: Partial<FloorProductFormValues>;
  pageTitle?: string;
}

export function FloorProductForm({ pageTitle, productId }: BlogFormProps) {
  const { methods, onSubmit, isLoading } = useFloorProduct({ productId });
  const { control, setValue } = methods;

  const { data: catalogs } = useGetStoneCatalogsQuery();
  const [createStoneCatalog] = useCreateStoneCatalogMutation();

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
                    label='Image (792x424)'
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
                    label='Color Image (104x80)'
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
                  <Autocomplete
                    options={catalogOptions}
                    value={field.value}
                    onChange={field.onChange}
                    onCreate={async (value) => {
                      try {
                        const newCatalog = await createStoneCatalog({
                          code: value
                        }).unwrap();
                        if (newCatalog) {
                          setValue('catalog_id', newCatalog.id);
                        }
                      } catch (error) {
                        toast.error('Failed to create catalog');
                      }
                    }}
                    placeholder='Select or create a catalog'
                    label='Catalog'
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
      {isLoading && <SpinnerOverlay />}
    </Card>
  );
}
