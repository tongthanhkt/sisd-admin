import {
  useCreateProductMutation,
  useGetProductQuery
} from '@/lib/api/products';
import { uploadFile } from '@/lib/upload';
import { IMutateProduct } from '@/types';
import { productFormSchema } from '@/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type FieldName = keyof ProductFormValues;

export const useProduct = ({ productId }: { productId: string }) => {
  const { data: productData } = useGetProductQuery(productId || '', {
    skip: !productId || productId === 'new'
  });

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

  const router = useRouter();

  const [createProduct] = useCreateProductMutation();

  const {
    formState: { errors }
  } = form;

  const prepareDataSubmit = async (
    values: ProductFormValues
  ): Promise<IMutateProduct> => {
    const { thumbnail, images } = values;
    const thumbnailUrl = await uploadFile(thumbnail?.[0]);

    const imagesResponse = await Promise.all(
      images?.map(async (image) => {
        const imageUrl = await uploadFile(image);
        return imageUrl;
      })
    );

    const advantages = values.advantages.map((advantage) => advantage.value);

    const transportationAndStorage = values.transportationAndStorage.map(
      (transportation) => transportation.value
    );

    return {
      code: values.code,
      name: values.name,
      category: values.category || '',
      shortDescription: values.shortDescription,
      description: values.description,
      image: thumbnailUrl.url || '',
      images: {
        main: imagesResponse?.[0]?.url || '',
        thumbnails: imagesResponse?.map((image) => image.url) || []
      },
      packaging: values.packaging,
      advantages,
      technicalSpecifications: {
        standard: values.technicalSpecifications.standard,
        specifications: values.technicalSpecifications.specifications.map(
          (spec) => ({
            category: spec.category,
            performance: spec.performance
          })
        )
      },
      transportationAndStorage,
      safetyRegulations: {
        warning: values.safetyRegulations.warning,
        notes: values.safetyRegulations.notes
      },
      isFeatured: values.isFeatured || false,
      relatedBlogs: values.relatedBlogs || [],
      relatedProduct: values.relatedProduct || []
    };
  };

  useEffect(() => {
    if (productData) {
      form.reset({
        code: productData.code,
        name: productData.name,
        category: productData.category,
        shortDescription: productData.shortDescription,
        description: productData.description,

        packaging: productData.packaging,
        advantages: productData.advantages?.map((advantage) => ({
          value: advantage
        })),
        technicalSpecifications: productData.technicalSpecifications,
        transportationAndStorage: productData.transportationAndStorage?.map(
          (transportation) => ({
            value: transportation
          })
        ),
        safetyRegulations: {
          warning: productData.safetyRegulations?.warning,
          notes: productData.safetyRegulations?.notes
        },
        isFeatured: productData.isFeatured,
        relatedBlogs: productData.relatedBlogs,
        relatedProduct: productData.relatedProduct
      });
    }
  }, [productData]);

  const onSubmit = async (values: ProductFormValues) => {
    try {
      const data = await prepareDataSubmit(values);
      const response = await createProduct(data);

      if ('error' in response && response.error) {
        const errorMessage =
          'data' in response.error && response.error.data
            ? (response.error.data as any)?.message
            : 'error' in response.error
              ? response.error.error
              : 'Something went wrong';
        toast.error(errorMessage);
        return;
      }

      form.reset();
      router.push('/dashboard/product');
    } catch (error) {
      console.error('🚀 ~ onSubmit error:', error);
    }
  };

  return {
    form,
    onSubmit
  };
};
