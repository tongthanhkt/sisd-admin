import { Button } from '@/components/ui/button';
import { FormField, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UploadMultipleIImage } from '@/components/UploadMultipleIImage';
import { BlogFormValues } from '@/features/blogs/utils/form-schema';
import { IUploadMultipleImageItem } from '@/types';
import React from 'react';
import {
  Path,
  useFieldArray,
  useFormContext,
  FieldPath
} from 'react-hook-form';

export const ArticleContent = ({ name }: { name: Path<BlogFormValues> }) => {
  const { control, setValue, watch } = useFormContext<BlogFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name
  });
  return (
    <div className='flex flex-col gap-2'>
      <FormLabel>Contents</FormLabel>
      <div className='flex flex-col gap-2'>
        {fields.map((field, index) => (
          <div
            className='flex flex-col gap-2 rounded-lg border border-solid border-neutral-200 p-4'
            key={field.id}
          >
            <FormField
              key={field.id}
              control={control}
              name={`${name}.${index}.content` as FieldPath<BlogFormValues>}
              render={({ field }) => <Textarea {...field} />}
            />
            <UploadMultipleIImage
              value={
                watch(`${name}.${index}.images` as FieldPath<BlogFormValues>) ||
                []
              }
              onValueChange={(images) => {
                setValue(
                  `${name}.${index}.images` as FieldPath<BlogFormValues>,
                  images as IUploadMultipleImageItem[]
                );
              }}
              cardClassName='h-40'
              listClassName='lg:grid-cols-5'
              withCaption
              label='Images'
            />
          </div>
        ))}
        <Button type='button' onClick={() => append({ content: '' })}>
          Add content
        </Button>
      </div>
    </div>
  );
};
