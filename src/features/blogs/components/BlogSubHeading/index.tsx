import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  FieldPath,
  Path,
  useFieldArray,
  useFormContext
} from 'react-hook-form';
import { BlogFormValues } from '../../utils/form-schema';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArticleContent } from '../ArticleContents';

export const BlogSubHeading = ({ name }: { name: Path<BlogFormValues> }) => {
  const { control } = useFormContext<BlogFormValues>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name
  });
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Sub Heading</FormLabel>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className='flex items-start gap-4 rounded-lg border border-solid border-neutral-200 bg-white p-4'
            >
              <div className='flex flex-1 flex-col gap-2'>
                <FormField
                  control={control}
                  name={`${name}.${index}.title` as FieldPath<BlogFormValues>}
                  render={({ field }) => <Input {...field} label='Title' />}
                />
                <FormField
                  control={control}
                  name={
                    `${name}.${index}.subTitle` as FieldPath<BlogFormValues>
                  }
                  render={({ field }) => <Input {...field} label='Sub Title' />}
                />
                <ArticleContent
                  name={`${name}.${index}.contents` as Path<BlogFormValues>}
                />
              </div>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => remove(index)}
                type='button'
              >
                <Trash2Icon className='size-5' />
              </Button>
            </div>
          ))}
          <Button
            variant='outline'
            onClick={() =>
              append({
                title: '',
                subTitle: '',
                contents: []
              })
            }
            type='button'
            className='ml-auto w-fit'
          >
            <PlusIcon className='size-4' /> Add sub heading
          </Button>
        </FormItem>
      )}
    />
  );
};
