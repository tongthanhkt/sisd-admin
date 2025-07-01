'use client';

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
import { productCategories } from '@/constants/products';
import { useProduct } from '../hooks/useProduct';
import { ProductImages } from './ProductImages';
import { SortableListField } from './SortableListField';
import { TechnicalSpecifications } from './TechnicalSpecifications.tsx';

export default function ProductForm({
  pageTitle,
  productId
}: {
  pageTitle: string;
  productId: string;
}) {
  const { form, onSubmit, isLoadingImages } = useProduct({ productId });

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
            <FormField
              control={form.control}
              name='name'
              render={({ field, fieldState: { error } }) => (
                <FormItem className='w-full'>
                  <FormControl>
                    <Input
                      placeholder='Enter product name'
                      {...field}
                      error={!!error}
                      helperText={error?.message}
                      label='Product Name'
                      required
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <ProductImages isLoadingImages={isLoadingImages} />

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='code'
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder='Enter product code'
                        {...field}
                        label='Product Code'
                        required
                        error={!!error}
                        helperText={error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='href'
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder='Enter href'
                        className='resize-none'
                        {...field}
                        label='Href'
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
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='packaging'
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder='Enter packaging information'
                        {...field}
                        label='Packaging'
                        required
                        error={!!error}
                        helperText={error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

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
                        placeholder='Enter product description'
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
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  <FormLabel>
                    Safety Regulations{' '}
                    <span className='text-destructive'>*</span>
                  </FormLabel>
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
                        required
                        error={!!error}
                        helperText={error?.message}
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
                        required
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit'>Save Product</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
