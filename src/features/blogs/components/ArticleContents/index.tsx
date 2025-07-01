import { Button } from '@/components/ui/button';
import { FormField, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UploadMultipleIImage } from '@/components/UploadMultipleIImage';
import { BlogFormValues } from '@/features/blogs/utils/form-schema';
import { IUploadMultipleImageItem } from '@/types';
import { GripVerticalIcon, Trash2Icon, TrashIcon } from 'lucide-react';
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
            className='flex gap-2 rounded-lg border border-solid border-neutral-200 p-4'
            key={field.id}
          >
            <div className='flex flex-1 flex-col gap-4'>
              <FormField
                key={field.id}
                control={control}
                name={`${name}.${index}.content` as FieldPath<BlogFormValues>}
                render={({ field }) => <Textarea {...field} />}
              />
              <UploadMultipleIImage
                value={
                  watch(
                    `${name}.${index}.images` as FieldPath<BlogFormValues>
                  ) || []
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
            <Button
              variant='ghost'
              size='icon'
              onClick={() => remove(index)}
              className='h-8 w-8'
              type='button'
            >
              <Trash2Icon className='size-5 text-red-600' />
            </Button>
            <Button type='button' variant='ghost' className='h-8 w-8'>
              <GripVerticalIcon className='size-5' />
            </Button>
          </div>
        ))}
        <Button type='button' onClick={() => append({ content: '' })}>
          Add content
        </Button>
      </div>
    </div>
  );
};
