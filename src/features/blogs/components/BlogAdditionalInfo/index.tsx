import { DatePicker } from '@/components/ui/date-picker';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { MultiSelect } from '@/components/ui/multi-select';
import { Switch } from '@/components/ui/switch';
import { BLOG_CATEGORIES_OPTIONS } from '@/constants/blog';
import { useFormContext } from 'react-hook-form';

export const BlogAdditionalInfo = () => {
  const methods = useFormContext();
  const { control, watch, setValue } = methods;

  const categories = watch('categories');

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      <MultiSelect
        options={BLOG_CATEGORIES_OPTIONS}
        placeholder='Select categories'
        label='Categories'
        value={categories}
        onChange={(value) => {
          setValue('categories', value);
        }}
      />
      <div className='flex items-center gap-4'>
        <DatePicker label='Date' />
        <FormField
          control={control}
          name='showArrowDesktop'
          render={({ field }) => (
            <FormItem className='mt-5 flex items-center gap-2'>
              <FormLabel>Show Arrow Desktop</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='isVertical'
          render={({ field }) => (
            <FormItem className='mt-5 flex items-center gap-2'>
              <FormLabel>Display Vertically</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
