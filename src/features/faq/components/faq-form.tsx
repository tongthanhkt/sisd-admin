'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField } from '@/components/ui/form';

import { UploadImage } from '@/components';
import { Textarea } from '@/components/ui/textarea';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FAQItem } from './FAQItem';
export function FAQForm({ faqId }: { faqId?: string }) {
  const methods = useForm();
  const { control, handleSubmit } = methods;

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {faqId ? 'Edit FAQ' : 'Create New FAQ'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...methods}>
          <form onSubmit={onSubmit} className='space-y-8'>
            <Controller
              control={control}
              name='id'
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  label='ID'
                  className='w-1/3'
                  required
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <FAQItem />
            <Button type='submit'>{faqId ? 'Update' : 'Create'}</Button>
          </form>
        </Form>
      </CardContent>
      {/* {isLoading && <SpinnerOverlay />} */}
    </Card>
  );
}
