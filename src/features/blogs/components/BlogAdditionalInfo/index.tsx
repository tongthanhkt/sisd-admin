import { AppSelect } from '@/components';
import { DatePicker } from '@/components/ui/date-picker';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { MultiSelect } from '@/components/ui/multi-select';
import { BLOG_CATEGORIES_OPTIONS } from '@/constants/blog';
import { useFormContext } from 'react-hook-form';

export const BlogAdditionalInfo = ({
  faqOptions
}: {
  faqOptions: { label: string; value: string }[];
}) => {
  const methods = useFormContext();
  const { control, watch, setValue, trigger } = methods;

  const categories = watch('categories');

  return (
    <div className='grid grid-cols-1 items-start gap-6 md:grid-cols-3'>
      <FormField
        control={control}
        name='categories'
        render={({ field, fieldState: { error } }) => (
          <FormItem>
            <FormControl>
              <MultiSelect
                {...field}
                options={BLOG_CATEGORIES_OPTIONS}
                placeholder='Select categories'
                label='Categories'
                value={categories}
                onChange={(value) => {
                  setValue('categories', value);
                  trigger('categories');
                }}
                required
                error={!!error}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='faqId'
        render={({ field }) => (
          <AppSelect
            {...field}
            onChange={field.onChange}
            value={field.value}
            label='FAQ'
            options={faqOptions}
            placeholder='Select FAQ'
            clearable
          />
        )}
      />
      <FormField
        control={control}
        name='date'
        render={({ field, fieldState: { error } }) => (
          <FormItem>
            <FormControl>
              <DatePicker
                label='Date'
                required
                error={!!error}
                date={field.value}
                setDate={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
