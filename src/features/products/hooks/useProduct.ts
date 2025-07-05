import {
  useCreateProductMutation,
  useGetProductQuery,
  useUpdateProductMutation
} from '@/lib/api/products';
import { uploadFile } from '@/lib/upload';
import { isFile, isUrl } from '@/lib/utils';
import { IMortalProduct } from '@/models/MortalProduct';
import { IMutateProduct } from '@/types';
import { productFormSchema } from '@/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type FieldName = keyof ProductFormValues;

export const useProduct = ({ productId }: { productId: string }) => {
  const { data: productData } = useGetProductQuery(productId || '', {
    skip: !productId || productId === 'new'
  });

  const [isLoadingImages, setIsLoadingImages] = useState(false);

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
      }
    }
  });

  const router = useRouter();

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const {
    formState: { errors },
    watch
  } = form;

  const prepareDataSubmit = async (
    values: ProductFormValues
  ): Promise<IMutateProduct> => {
    const { thumbnail, images } = values;

    // Handle thumbnail upload
    let thumbnailUrl = '';
    if (thumbnail && thumbnail.length > 0) {
      if (isFile(thumbnail[0])) {
        // New file uploaded
        const uploadResult = await uploadFile(thumbnail[0]);
        thumbnailUrl = uploadResult.url || '';
      } else if (isUrl(thumbnail[0])) {
        // Existing URL, keep it
        thumbnailUrl = thumbnail[0];
      }
    }

    // Handle images upload (now array of { file, caption? })
    let imagesResponse: { url: string; caption?: string }[] = [];
    if (images && images.length > 0) {
      const uploadPromises = images.map(async (imgObj) => {
        const { file, caption } = imgObj;
        if (isFile(file)) {
          // New file uploaded
          const uploadResult = await uploadFile(file);
          return { url: uploadResult.url || '', caption };
        } else if (isUrl(file)) {
          // Existing URL, keep it
          return { url: file, caption };
        }
        return { url: '', caption };
      });
      imagesResponse = await Promise.all(uploadPromises);
    }

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
      image: thumbnailUrl,
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
      }
    };
  };

  // Convert API image URLs to displayable values (no fetch)
  const convertImagesFromAPI = async (productData: IMortalProduct) => {
    setIsLoadingImages(true);
    try {
      const thumbnailFiles: string[] = [];
      const imageFiles: { file: string }[] = [];

      // Just push the URL string
      if (productData.image) {
        thumbnailFiles.push(productData.image);
      }

      if (productData.images) {
        const allImages = [...(productData.images.thumbnails || [])].filter(
          (url): url is string => Boolean(url)
        );
        imageFiles.push(...allImages.map((url) => ({ file: url })));
      }

      return { thumbnailFiles, imageFiles };
    } finally {
      setIsLoadingImages(false);
    }
  };

  useEffect(() => {
    const loadProductData = async () => {
      if (productData) {
        try {
          const { thumbnailFiles, imageFiles } =
            await convertImagesFromAPI(productData);

          form.reset({
            code: productData.code || '',
            name: productData.name || '',
            category: productData.category || '',
            shortDescription: productData.shortDescription || '',
            description: productData.description || '',
            thumbnail: thumbnailFiles,
            images: imageFiles,
            packaging: productData.packaging || '',
            advantages:
              productData.advantages?.map((advantage) => ({
                value: advantage,
                id: Math.random().toString(36).substring(2, 15)
              })) || [],
            technicalSpecifications: {
              standard: productData.technicalSpecifications?.standard || '',
              specifications:
                productData.technicalSpecifications?.specifications?.map(
                  (spec) => ({
                    ...spec,
                    id: Math.random().toString(36).substring(2, 15)
                  })
                ) || []
            },
            transportationAndStorage:
              productData.transportationAndStorage?.map((transportation) => ({
                value: transportation,
                id: Math.random().toString(36).substring(2, 15)
              })) || [],
            safetyRegulations: {
              warning: productData.safetyRegulations?.warning || '',
              notes: productData.safetyRegulations?.notes || ''
            }
          });
        } catch (error) {
          console.error('Error loading product data:', error);
          toast.error('Error loading product images');
        }
      }
    };

    loadProductData();
  }, [productData]);

  const onSubmit = async (values: ProductFormValues) => {
    try {
      const data = await prepareDataSubmit(values);

      let response;
      if (productId && productId !== 'new') {
        // Update existing product
        response = await updateProduct({ id: productId, ...data });
      } else {
        // Create new product
        response = await createProduct(data);
      }

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

      toast.success(
        productId && productId !== 'new'
          ? 'Product updated successfully'
          : 'Product created successfully'
      );
      form.reset();
      router.push('/dashboard/product');
    } catch (error) {
      console.error('🚀 ~ onSubmit error:', error);
      toast.error('An error occurred while saving the product');
    }
  };

  return {
    form,
    onSubmit,
    isLoadingImages
  };
};
