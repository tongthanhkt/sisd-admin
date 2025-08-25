'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField } from '@/components/ui/form';

import { UploadVideo } from '@/components';
import { Input } from '@/components/ui/input';
import { useHomeVideo } from '../../hooks/useHomeVideo';

interface HomeVideoFormProps {
  videoId?: string;
  pageTitle?: string;
}

export function HomeVideoForm({ pageTitle, videoId }: HomeVideoFormProps) {
  const { methods, onSubmit } = useHomeVideo({ videoId });
  const { control } = methods;

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
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  label='Name'
                  required
                  error={!!error?.message}
                  helperText={error?.message}
                />
              )}
            />
            <FormField
              control={control}
              name='video_url'
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
