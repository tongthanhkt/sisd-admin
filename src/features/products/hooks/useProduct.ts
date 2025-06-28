import { productFormSchema } from '@/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type FieldName = keyof ProductFormValues;

export const useProduct = () => {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      code: '',
      name: '',
      category: 'MORTAL',
      shortDescription: '',
      description: '',
      image: '',
      images: {
        main: '',
        thumbnails: []
      },
      packaging: '',
      advantages: [],
      technicalSpecifications: {
        standard: '',
        specifications: []
      },
      transportationAndStorage: [],
      safetyRegulations: {
        standard: '',
        specifications: []
      },
      isFeatured: false
    }
  });

  const onSubmit = async (values: ProductFormValues) => {
    try {
      const payload = {
        ...values,
        image: values.image,
        images: {
          thumbnails: values.images.thumbnails
        },
        technicalSpecifications: values.technicalSpecifications,
        transportationAndStorage: values.transportationAndStorage,
        safetyRegulations: values.safetyRegulations
      };
      console.log('🚀 ~ onSubmit ~ payload:', payload);

      toast.success('Lưu sản phẩm thành công!');
      form.reset();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu sản phẩm!');
    }
  };

  return {
    form,
    onSubmit
  };
};
