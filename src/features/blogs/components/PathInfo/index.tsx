import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export const PathInfo = () => {
  const methods = useFormContext();
  const { control } = methods;

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      <FormField
        control={control}
        name='href'
        render={({ field, fieldState: { error } }) => (
          <FormItem>
            <FormControl>
              <Input
                label='Href'
                required
                placeholder='Enter href'
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
        name='slug'
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                label='Slug'
                required
                placeholder='Enter slug'
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
