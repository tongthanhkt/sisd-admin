'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField } from '@/components/ui/form';

import { UploadVideo } from '@/components';
import { Input } from '@/components/ui/input';
import { SpinnerOverlay } from '@/components/ui/spinner';
import { useHomeVideo } from '../../hooks/useHomeVideo';
import { AppSelect } from '@/components/AppSelect';
import { VIDEO_PAGE_OPTIONS } from '@/constants/video';

interface HomeVideoFormProps {
  videoId?: string;
  pageTitle?: string;
}

export function HomeVideoForm({ pageTitle, videoId }: HomeVideoFormProps) {
  const { methods, onSubmit, isLoading } = useHomeVideo({ videoId });
  const { control } = methods;

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle || (videoId ? 'Edit Video' : 'Create New Video')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...methods}>
          <form onSubmit={onSubmit} className='space-y-8'>
            <div className='flex gap-6'>
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
                name='page'
                render={({ field }) => (
                  <AppSelect
                    {...field}
                    className='w-1/3'
                    onChange={field.onChange}
                    value={field.value}
                    options={VIDEO_PAGE_OPTIONS}
                    label='Page'
                    required
                  />
                )}
              />
            </div>
            <FormField
              control={control}
              name='video'
              render={({ field, fieldState: { error } }) => (
                <UploadVideo
                  {...field}
                  onValueChange={field.onChange}
                  maxFiles={1}
                  maxSize={100 * 1024 * 1024}
                  required
                  label='Video'
                  disabled={!!videoId}
                />
              )}
            />
            <Button type='submit'>{videoId ? 'Update' : 'Create'}</Button>
          </form>
        </Form>
      </CardContent>
      {isLoading && <SpinnerOverlay />}
    </Card>
  );
}
