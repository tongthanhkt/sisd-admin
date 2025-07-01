import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from 'react-hook-form';

export const BlogDescriptions = () => {
  const methods = useFormContext();
  const { control } = methods;

  return (
    <div className='grid grid-cols-1 gap-6'>
      <FormField
        control={control}
        name='shortDescription'
        render={({ field, fieldState: { error } }) => (
          <FormItem>
            <FormControl>
              <Textarea
                label='Short Description'
                required
                placeholder='Enter short description'
                className='resize-none'
                {...field}
                error={!!error}
                helperText={error?.message}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='description'
        render={({ field, fieldState: { error } }) => (
          <FormItem>
            <FormControl>
              <Textarea
                placeholder='Enter description'
                className='resize-none'
                {...field}
                label='Description'
                required
                error={!!error}
                helperText={error?.message}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
