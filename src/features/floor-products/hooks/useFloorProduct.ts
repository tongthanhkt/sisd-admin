import { IDocument } from '@/models/Document';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { floorProductFormSchema } from '../utils/form-schema';
import { ICatalogProduct } from '@/types';
import { isFile, isUrl } from '@/lib/utils';
import { uploadFile } from '@/lib/upload';
import { useCreateStoneProductMutation } from '@/lib/api/catalog';
import { toast } from 'sonner';

export type FloorProductFormValues = z.infer<typeof floorProductFormSchema>;
export type FieldName = keyof FloorProductFormValues;

export const useFloorProduct = ({ productId }: { productId?: string }) => {
  const [isLoadingFile, setIsLoadingFile] = useState(false);

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

    const imageIsFile = image_url?.[0] && isFile(image_url[0]);
    const colorImageIsFile = color_image_url?.[0] && isFile(color_image_url[0]);

    if (imageIsFile || colorImageIsFile) {
      setIsLoadingFile(true);
    }

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
        content: content.replace(/([^\n]+)\\n([^\n]+)/g, '$1/n $2'),
        catalog_id
      };
    } finally {
      if (imageIsFile || colorImageIsFile) {
        setIsLoadingFile(false);
      }
    }
  };

  // Convert API file URL to displayable values
  const convertFileFromAPI = async (documentData: IDocument) => {
    setIsLoadingFile(true);
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
    } finally {
      setIsLoadingFile(false);
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
    console.log('🚀 ~ useFloorProduct ~ values:', values);
    try {
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
    }
  });

  return {
    methods,
    onSubmit,
    isLoadingFile
  };
};
