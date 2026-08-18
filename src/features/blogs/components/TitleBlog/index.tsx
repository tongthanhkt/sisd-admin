import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useFormContext, useWatch } from 'react-hook-form';
import { useEffect, useRef, useCallback } from 'react';

/**
 * Client-side slugify function matching the backend logic.
 * Removes Vietnamese diacritics and converts to URL-friendly slug.
 */
const vietnameseMap: Record<string, string> = {
  à: 'a', á: 'a', ả: 'a', ã: 'a', ạ: 'a',
  ă: 'a', ằ: 'a', ắ: 'a', ẳ: 'a', ẵ: 'a', ặ: 'a',
  â: 'a', ầ: 'a', ấ: 'a', ẩ: 'a', ẫ: 'a', ậ: 'a',
  è: 'e', é: 'e', ẻ: 'e', ẽ: 'e', ẹ: 'e',
  ê: 'e', ề: 'e', ế: 'e', ể: 'e', ễ: 'e', ệ: 'e',
  ì: 'i', í: 'i', ỉ: 'i', ĩ: 'i', ị: 'i',
  ò: 'o', ó: 'o', ỏ: 'o', õ: 'o', ọ: 'o',
  ô: 'o', ồ: 'o', ố: 'o', ổ: 'o', ỗ: 'o', ộ: 'o',
  ơ: 'o', ờ: 'o', ớ: 'o', ở: 'o', ỡ: 'o', ợ: 'o',
  ù: 'u', ú: 'u', ủ: 'u', ũ: 'u', ụ: 'u',
  ư: 'u', ừ: 'u', ứ: 'u', ử: 'u', ữ: 'u', ự: 'u',
  ỳ: 'y', ý: 'y', ỷ: 'y', ỹ: 'y', ỵ: 'y',
  đ: 'd',
  À: 'a', Á: 'a', Ả: 'a', Ã: 'a', Ạ: 'a',
  Ă: 'a', Ằ: 'a', Ắ: 'a', Ẳ: 'a', Ẵ: 'a', Ặ: 'a',
  Â: 'a', Ầ: 'a', Ấ: 'a', Ẩ: 'a', Ẫ: 'a', Ậ: 'a',
  È: 'e', É: 'e', Ẻ: 'e', Ẽ: 'e', Ẹ: 'e',
  Ê: 'e', Ề: 'e', Ế: 'e', Ể: 'e', Ễ: 'e', Ệ: 'e',
  Ì: 'i', Í: 'i', Ỉ: 'i', Ĩ: 'i', Ị: 'i',
  Ò: 'o', Ó: 'o', Ỏ: 'o', Õ: 'o', Ọ: 'o',
  Ô: 'o', Ồ: 'o', Ố: 'o', Ổ: 'o', Ỗ: 'o', Ộ: 'o',
  Ơ: 'o', Ờ: 'o', Ớ: 'o', Ở: 'o', Ỡ: 'o', Ợ: 'o',
  Ù: 'u', Ú: 'u', Ủ: 'u', Ũ: 'u', Ụ: 'u',
  Ư: 'u', Ừ: 'u', Ứ: 'u', Ử: 'u', Ữ: 'u', Ự: 'u',
  Ỳ: 'y', Ý: 'y', Ỷ: 'y', Ỹ: 'y', Ỵ: 'y',
  Đ: 'd'
};

function slugify(text: string): string {
  if (!text) return '';
  return text
    .split('')
    .map((char) => vietnameseMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 255);
}

export const TitleBlog = () => {
  const methods = useFormContext();
  const { control, setValue, getValues } = methods;
  const isManualSlugEdit = useRef(false);

  const title = useWatch({ control, name: 'title' });
  const slug = useWatch({ control, name: 'slug' });

  // Auto-generate slug from title when user hasn't manually edited slug
  useEffect(() => {
    if (!isManualSlugEdit.current && title) {
      setValue('slug', slugify(title), { shouldDirty: true });
    }
  }, [title, setValue]);

  const handleSlugChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      isManualSlugEdit.current = true;
      // Sanitize user input: allow only lowercase, numbers, and hyphens
      const sanitized = e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-');
      setValue('slug', sanitized, { shouldDirty: true });
    },
    [setValue]
  );

  const handleSlugBlur = useCallback(() => {
    // On blur, trim leading/trailing hyphens
    const currentSlug = getValues('slug');
    if (currentSlug) {
      setValue('slug', currentSlug.replace(/^-|-$/g, ''), {
        shouldDirty: true
      });
    }
    // If slug is empty after trim, reset to auto-generate mode
    if (!getValues('slug')) {
      isManualSlugEdit.current = false;
    }
  }, [getValues, setValue]);

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-4'>
        <FormField
          control={control}
          name='title'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <Input
                  placeholder='Enter title'
                  {...field}
                  label='Title'
                  required
                />
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

      {/* Slug field */}
      <FormField
        control={control}
        name='slug'
        render={({ field }) => (
          <FormItem className='w-full'>
            <FormLabel>Đường dẫn (Slug)</FormLabel>
            <FormControl>
              <Input
                placeholder='duong-dan-bai-viet'
                value={field.value || ''}
                onChange={handleSlugChange}
                onBlur={handleSlugBlur}
              />
            </FormControl>
            {slug && (
              <p className='text-xs text-muted-foreground mt-1'>
                Preview: sisd.vn/blog/<span className='font-medium'>{slug}</span>
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
