import { productFormSchema } from '@/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type FieldName = keyof ProductFormValues;

export const useProduct = () => {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    mode: 'onChange',
    defaultValues: {
      code: '',
      name: '',
      category: 'MORTAL',
      shortDescription: '',
      description: '',
      thumbnail: undefined,
      images: undefined,
      packaging: '',
      advantages: [],
      technicalSpecifications: {
        standard: '',
        specifications: []
      },
      transportationAndStorage: [],
      safetyRegulations: {
        warning: '',
        notes: ''
      },
      isFeatured: false,
      relatedBlogs: [],
      relatedProduct: []
    }
  });

  const {
    formState: { errors }
  } = form;

  const onSubmit = async (values: ProductFormValues) => {
    try {
      const payload = {
        ...values,
        thumbnail: values.thumbnail,
        images: values.images,
        technicalSpecifications: values.technicalSpecifications,
        transportationAndStorage: values.transportationAndStorage,
        safetyRegulations: values.safetyRegulations
      };
      form.reset();
    } catch (error) {
      console.error('🚀 ~ onSubmit error:', error);
    }
  };

  return {
    form,
    onSubmit
  };
};
