import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from 'react-hook-form';

export const BlogSummary = () => {
  const methods = useFormContext();
  const { control } = methods;
  return (
    <div className='grid grid-cols-1 gap-6'>
      <FormField
        control={control}
        name='summary'
        render={({ field, fieldState: { error } }) => (
          <FormItem>
            <FormControl>
              <Textarea
                label='Summary'
                placeholder='Enter summary'
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
        name='contact'
        render={({ field, fieldState: { error } }) => (
          <FormItem>
            <FormControl>
              <Textarea
                placeholder='Enter contact'
                className='resize-none'
                {...field}
                label='Contact'
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
