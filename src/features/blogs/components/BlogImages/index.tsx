import React from 'react';
import { useFormContext } from 'react-hook-form';
import { BlogFormValues } from '../../utils/form-schema';
import { FormField } from '@/components/ui/form';
import { UploadImage } from '@/components';

export const BlogImages = () => {
  const {
    control,
    setValue,
    formState: { errors }
  } = useFormContext<BlogFormValues>();
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      <FormField
        control={control}
        name='banner'
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
            maxSize={4 * 1024 * 1024}
            label='Banner'
          />
        )}
      />

      <FormField
        control={control}
        name='thumbnail'
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
            maxSize={4 * 1024 * 1024}
            label='Thumbnail'
          />
        )}
      />
    </div>
  );
};
