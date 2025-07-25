import { useCreateStoneProductMutation } from '@/lib/api/catalog';
import { uploadFile } from '@/lib/upload';
import { isFile, isUrl } from '@/lib/utils';
import { IDocument } from '@/models/Document';
import { ICatalogProduct } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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

  // Convert API file URL to displayable values
  const convertFileFromAPI = async (documentData: IDocument) => {
    try {
      const fileUrls = [];

      if (documentData.file?.url) {
        fileUrls.push({
          url: documentData.file.url,
          size: documentData.file.size,
          name: documentData.file.name,
          type: documentData.file.type,
          preview: documentData.file.url
        });
      }

      return { fileUrls };
    } catch (error) {
      console.error('Error converting file from API:', error);
      throw error;
    }
  };

  // useEffect(() => {
  //   const loadDocumentData = async () => {
  //     if (documentData) {
  //       try {
  //         const { fileUrls } = await convertFileFromAPI(documentData);

  //         reset({
  //           filename: documentData.filename || '',
  //           category: documentData.category || 'COMPANY_PROFILE',
  //           file: fileUrls
  //         });
  //       } catch (error) {
  //         console.error('Error loading document data:', error);
  //         toast.error('Error loading document file');
  //       }
  //     }
  //   };

  //   loadDocumentData();
  // }, [documentData]);

  const onSubmit = handleSubmit(async (values: FloorProductFormValues) => {
    try {
      setIsLoading(true);
      const data = await prepareDataSubmit(values);
      let response;
      if (productId && productId !== 'new') {
        // Update existing document
        // response = await updateDocument({ id: productId, ...data });
      } else {
        // Create new document
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
          ? 'Document updated successfully'
          : 'Document created successfully'
      );
      reset();
      router.push('/dashboard/floor-products');
    } catch (error) {
      console.error('🚀 ~ onSubmit error:', error);
      toast.error('An error occurred while saving the document');
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
