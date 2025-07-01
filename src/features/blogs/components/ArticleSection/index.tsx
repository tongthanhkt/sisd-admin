import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UploadMultipleIImage } from '@/components/UploadMultipleIImage';
import { IUploadMultipleImageItem } from '@/types';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { BlogFormValues } from '../../utils/form-schema';
import { ArticleContent } from '../ArticleContents';

export const ArticleSection = () => {
  const methods = useFormContext<BlogFormValues>();
  const { control, watch, setValue } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'articleSections'
  });

  return (
    <FormField
      control={control}
      name='articleSections'
      render={({ field }) => {
        const articleSections = watch('articleSections');
        return (
          <FormItem>
            <FormLabel>Article Sections</FormLabel>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className='space-y-4 rounded-lg border border-solid p-4'
              >
                <FormField
                  control={control}
                  name={`articleSections.${index}.headline`}
                  render={({ field }) => (
                    <Input
                      label='Headline'
                      placeholder='Enter headline'
                      {...field}
                    />
                  )}
                />{' '}
                <FormField
                  control={control}
                  name={`articleSections.${index}.headline2`}
                  render={({ field }) => (
                    <Input
                      label='Headline 2'
                      placeholder='Enter headline 2'
                      {...field}
                    />
                  )}
                />
                <UploadMultipleIImage
                  label='Images'
                  value={articleSections[index].images || []}
                  onValueChange={(files) => {
                    setValue(
                      `articleSections.${index}.images`,
                      files as IUploadMultipleImageItem[]
                    );
                  }}
                  cardClassName='h-40'
                  listClassName='lg:grid-cols-5'
                  withCaption
                />
                <ArticleContent name={`articleSections.${index}.contents`} />
              </div>
            ))}
            <Button
              onClick={() =>
                append({
                  headline: '',
                  headline2: '',
                  contents: [],
                  images: [],
                  subHeadline: []
                })
              }
              type='button'
            >
              Add article
            </Button>
          </FormItem>
        );
      }}
    />
  );
};
