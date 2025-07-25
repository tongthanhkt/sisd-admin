import {
  useCreateStoneProductMutation,
  useGetStoneProductQuery,
  useUpdateStoneProductMutation
} from '@/lib/api/catalog';
import { uploadFile } from '@/lib/upload';
import { isFile, isUrl } from '@/lib/utils';
import { IDocument } from '@/models/Document';
import { ICatalogProduct } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { floorProductFormSchema } from '../utils/form-schema';

export type FloorProductFormValues = z.infer<typeof floorProductFormSchema>;
export type FieldName = keyof FloorProductFormValues;

export const useFloorProduct = ({ productId }: { productId?: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<FloorProductFormValues>({
    resolver: zodResolver(floorProductFormSchema),
    mode: 'onChange',
    defaultValues: {
      image_url: [],
      color_image_url: [],
      color_name: '',
      content: '',
      catalog_id: ''
    }
  });

  const router = useRouter();

  const {
    formState: { errors },
    watch,
    reset,
    handleSubmit
  } = methods;

  const [createStoneProduct] = useCreateStoneProductMutation();
  const [updateStoneProduct] = useUpdateStoneProductMutation();
  ``;
  const { data: product } = useGetStoneProductQuery(productId || '', {
    skip: !productId
  });

  const uploadImage = async (file: File) => {
    const uploadResult = await uploadFile(file);
    return uploadResult.url || '';
  };

  const prepareDataSubmit = async (
    values: FloorProductFormValues
  ): Promise<Omit<ICatalogProduct, 'id' | 'createdAt'>> => {
    const { image_url, color_image_url, color_name, content, catalog_id } =
      values;

    try {
      const imageUrlPromise = image_url?.[0]
        ? isFile(image_url[0])
          ? uploadImage(image_url[0])
          : Promise.resolve(isUrl(image_url[0]) ? image_url[0] : '')
        : Promise.resolve('');

      const colorImageUrlPromise = color_image_url?.[0]
        ? isFile(color_image_url[0])
          ? uploadImage(color_image_url[0])
          : Promise.resolve(isUrl(color_image_url[0]) ? color_image_url[0] : '')
        : Promise.resolve('');

      const [resolvedImageUrl, resolvedColorImageUrl] = await Promise.all([
        imageUrlPromise,
        colorImageUrlPromise
      ]);

      return {
        image_url: resolvedImageUrl || '',
        color_image_url: resolvedColorImageUrl || '',
        color_name,
        content: content.replaceAll('\n', '/n '),
        catalog_id
      };
    } catch (error) {
      console.error('Error preparing data submit:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadProductData = async () => {
      if (product) {
        try {
          reset({
            image_url: [product.image_url],
            color_image_url: [product.color_image_url],
            color_name: product.color_name,
            catalog_id: product.catalog_id,
            content: product.content.replaceAll('/n ', '\n')
          });
        } catch (error) {
          console.error('Error loading document data:', error);
          toast.error('Error loading document file');
        }
      }
    };

    loadProductData();
  }, [product, reset]);

  const onSubmit = handleSubmit(async (values: FloorProductFormValues) => {
    try {
      setIsLoading(true);
      const data = await prepareDataSubmit(values);
      let response;
      if (productId && productId !== 'new') {
        response = await updateStoneProduct({ id: productId, product: data });
      } else {
        response = await createStoneProduct(data);
      }
      if (response && 'error' in response && response.error) {
        const errorMessage =
          'data' in response.error && response.error.data
            ? (response.error.data as any)?.message
            : 'error' in response.error
              ? response.error.error
              : 'Something went wrong';
        toast.error(errorMessage);
        return;
      }
      toast.success(
        productId && productId !== 'new'
          ? 'Product updated successfully'
          : 'Product created successfully'
      );
      reset();
      router.push('/dashboard/floor-products');
    } catch (error) {
      console.error('🚀 ~ onSubmit error:', error);
      toast.error('An error occurred while saving the product');
    } finally {
      setIsLoading(false);
    }
  });

  return {
    methods,
    onSubmit,
    isLoading
  };
};
