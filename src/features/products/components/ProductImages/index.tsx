import { FormField } from '@/components/ui/form';
import { UploadImage } from '@/components/UploadImage';
import { UploadMultipleIImage } from '@/components/UploadMultipleIImage';
import { useFormContext } from 'react-hook-form';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductImagesProps {
  isLoadingImages?: boolean;
}

export const ProductImages = ({
  isLoadingImages = false
}: ProductImagesProps) => {
  const methods = useFormContext();
  const {
    control,
    setValue,
    formState: { errors }
  } = methods;
  const { watch } = methods;
  const images = watch('images');

  if (isLoadingImages) {
    return (
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-60 w-full' />
        </div>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-24' />
          <div className='grid grid-cols-2 gap-3'>
            <Skeleton className='h-28 w-full' />
            <Skeleton className='h-28 w-full' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      <FormField
        control={control}
        name='thumbnail'
        render={({ field }) => (
          <UploadImage
            {...field}
            className='h-60'
            onValueChange={async (files) => {
              if (files) {
                field.onChange(files);
              }
            }}
            maxFiles={1}
            maxSize={4 * 1024 * 1024}
          />
        )}
      />

      <UploadMultipleIImage
        value={images || []}
        onValueChange={(files) => {
          setValue('images', files);
        }}
        error={!!errors.images}
        helperText={errors.images?.message as string}
      />
    </div>
  );
};
