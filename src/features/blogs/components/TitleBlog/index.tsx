import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useFormContext } from 'react-hook-form';

export const TitleBlog = () => {
  const methods = useFormContext();
  const { control } = methods;
  return (
    <div className='flex items-center gap-4'>
      <FormField
        control={control}
        name='title'
        render={({ field }) => (
          <FormItem className='w-full'>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder='Enter title' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='isOustanding'
        render={({ field }) => (
          <FormItem className='mt-5 flex items-center gap-2'>
            <FormLabel className='w-max'>Mark as Featured</FormLabel>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
