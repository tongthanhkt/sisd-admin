'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField } from '@/components/ui/form';

import { UploadVideo } from '@/components';
import { Input } from '@/components/ui/input';
import { SpinnerOverlay } from '@/components/ui/spinner';
import { useForm } from 'react-hook-form';

interface HomeVideoFormProps {
  videoId?: string;
  pageTitle?: string;
}

export function HomeVideoForm({ pageTitle, videoId }: HomeVideoFormProps) {
  //   const { methods, onSubmit, isLoading } = useFloorProduct({ videoId });
  const methods = useForm();
  const { control, setValue, handleSubmit } = methods;
  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle || (videoId ? 'Edit Home Video' : 'Create New Home Video')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...methods}>
          <form onSubmit={onSubmit} className='space-y-8'>
            <FormField
              control={control}
              name='name'
              render={({ field }) => <Input {...field} label='Name' />}
            />
            <FormField
              control={control}
              name='video'
              render={({ field }) => (
                <UploadVideo
                  {...field}
                  onValueChange={async (files) => {
                    if (files) {
                      field.onChange(files);
                    }
                  }}
                  maxFiles={1}
                  maxSize={100 * 1024 * 1024}
                  required
                  label='Video '
                />
              )}
            />{' '}
            <Button type='submit'>{videoId ? 'Update' : 'Create'}</Button>
          </form>
        </Form>
      </CardContent>
      {/* {isLoading && <SpinnerOverlay />} */}
    </Card>
  );
}
