'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

import { AppSelect } from '@/components';
import { FileUploader } from '@/components/file-uploader';
import { Input } from '@/components/ui/input';
import { DOCUMENT_OPTIONS } from '@/constants/document';
import { useDocument } from '../hooks/useDocument';
import { DocumentFormValues } from '../utils/form-schema';

interface BlogFormProps {
  documentId?: string;
  initialData?: Partial<DocumentFormValues>;
  pageTitle?: string;
}

export function DocumentForm({ pageTitle, documentId }: BlogFormProps) {
  const { methods, onSubmit } = useDocument({ documentId });
  const { control } = methods;

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle ||
            (documentId ? 'Edit Blog Document' : 'Create New Document')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...methods}>
          <form onSubmit={onSubmit} className='space-y-8'>
            <div className='grid grid-cols-1 items-start gap-4 md:grid-cols-2'>
              <FormField
                control={control}
                name='filename'
                render={({ field, fieldState: { error } }) => (
                  <FormItem className='w-full'>
                    <FormControl>
                      <Input
                        placeholder='Enter document name'
                        {...field}
                        error={!!error}
                        helperText={error?.message}
                        label='Document Name'
                        required
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='category'
                render={({ field }) => (
                  <AppSelect
                    onChange={field.onChange}
                    value={field.value}
                    label='Category'
                    options={DOCUMENT_OPTIONS}
                    placeholder='Select Category'
                    required
                  />
                )}
              />
            </div>
            <FormField
              control={control}
              name='file'
              render={({ field }) => (
                <FileUploader
                  accept={{ 'application/pdf': ['.pdf'] }}
                  maxSize={1024 * 1024 * 10}
                  maxFiles={1}
                  onValueChange={async (files) => {
                    field.onChange(files);
                  }}
                  value={field.value as File[]}
                />
              )}
            />

            <Button type='submit'>{documentId ? 'Update' : 'Create'}</Button>
          </form>
        </Form>
      </CardContent>
      {/* {isLoading && <SpinnerOverlay />} */}
    </Card>
  );
}
