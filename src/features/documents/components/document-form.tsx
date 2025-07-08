'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form';

import { useForm } from 'react-hook-form';
import { documentFormSchema, DocumentFormValues } from '../utils/form-schema';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { DOCUMENT_OPTIONS } from '@/constants/document';
import { FileUploader } from '@/components/file-uploader';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppSelect } from '@/components';

interface BlogFormProps {
  blogId?: string;
  initialData?: Partial<DocumentFormValues>;
  pageTitle?: string;
}

export function DocumentForm({ pageTitle, blogId }: BlogFormProps) {
  const methods = useForm({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      category: DOCUMENT_OPTIONS[0].value,
      filename: '',
      file: undefined
    }
  });
  const { control, handleSubmit } = methods;
  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle || (blogId ? 'Edit Blog Document' : 'Create New Document')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...methods}>
          <form
            onSubmit={handleSubmit((data) => console.log(data))}
            className='space-y-8'
          >
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
                  onUpload={async (files) => {
                    field.onChange(files);
                  }}
                  value={field.value}
                />
              )}
            />

            <Button type='submit'>{blogId ? 'Update' : 'Create'}</Button>
          </form>
        </Form>
      </CardContent>
      {/* {isLoading && <SpinnerOverlay />} */}
    </Card>
  );
}
