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
    mode: 'onBlur',
    reValidateMode: 'onChange',
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
        warning: '',
        notes: ''
      },
      isFeatured: false
    }
  });

  const {
    formState: { errors, isValid, isDirty, isSubmitting }
  } = form;
  console.log('🚀 ~ useProduct ~ errors:', errors);
  console.log('🚀 ~ useProduct ~ isValid:', isValid);
  console.log('🚀 ~ useProduct ~ isDirty:', isDirty);
  console.log('🚀 ~ useProduct ~ isSubmitting:', isSubmitting);
  console.log('🚀 ~ useProduct ~ form values:', form.getValues());

  const onSubmit = async (values: ProductFormValues) => {
    console.log('🚀 ~ onSubmit called with values:', values);

    try {
      // Validate all fields before proceeding
      const validationResult = await form.trigger();
      console.log('🚀 ~ validation result:', validationResult);

      if (!validationResult) {
        console.log('🚀 ~ Form validation failed:', form.formState.errors);
        toast.error('Vui lòng kiểm tra lại thông tin!');
        return;
      }

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
      console.error('🚀 ~ onSubmit error:', error);
      toast.error('Có lỗi xảy ra khi lưu sản phẩm!');
    }
  };

  return {
    form,
    onSubmit
  };
};
