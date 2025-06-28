import { FormField } from '@/components/ui/form';
import { UploadImage } from '@/components/UploadImage';
import { UploadMultipleIImage } from '@/components/UploadMultipleIImage';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

export const ProductImages = () => {
  const methods = useFormContext();
  const { control } = methods;

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedMultipleFiles, setUploadedMultipleFiles] = useState<File[]>(
    []
  );

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      <FormField
        control={control}
        name='image'
        render={({ field }) => (
          <UploadImage
            value={uploadedFiles}
            className='h-60'
            onValueChange={async (files) => {
              if (files) {
                setUploadedFiles(files);
                field.onChange(files);
              }
            }}
            maxFiles={1}
            maxSize={4 * 1024 * 1024}
          />
        )}
      />

      <UploadMultipleIImage
        value={uploadedMultipleFiles}
        onValueChange={setUploadedMultipleFiles}
      />
    </div>
  );
};
