import {
  useCreateDocumentMutation,
  useGetDocumentQuery,
  useUpdateDocumentMutation
} from '@/lib/api/documents';
import { uploadFile } from '@/lib/upload';
import { isFile, isUrl } from '@/lib/utils';
import { IDocument } from '@/models/Document';
import { CreateDocumentRequest } from '@/types';
import { documentFormSchema } from '../utils/form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

export type DocumentFormValues = z.infer<typeof documentFormSchema>;
export type FieldName = keyof DocumentFormValues;

export const useDocument = ({ documentId }: { documentId?: string }) => {
  const { data: documentData } = useGetDocumentQuery(documentId || '', {
    skip: !documentId || documentId === 'new'
  });

  const [isLoadingFile, setIsLoadingFile] = useState(false);

  const methods = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    mode: 'onChange',
    defaultValues: {
      filename: '',
      category: 'COMPANY_PROFILE',
      file: undefined
    }
  });

  const router = useRouter();

  const [createDocument] = useCreateDocumentMutation();
  const [updateDocument] = useUpdateDocumentMutation();

  const {
    formState: { errors },
    watch,
    reset,
    handleSubmit
  } = methods;

  const prepareDataSubmit = async (
    values: DocumentFormValues
  ): Promise<CreateDocumentRequest> => {
    const { file } = values;

    // Handle file upload
    let fileData = {
      name: '',
      size: 0,
      url: '',
      type: ''
    };

    if (file && file.length > 0) {
      if (isFile(file[0])) {
        // New file uploaded
        setIsLoadingFile(true);
        try {
          const uploadResult = await uploadFile(file[0]);
          fileData = {
            name: file[0].name,
            size: file[0].size,
            url: uploadResult.url || '',
            type: file[0].type
          };
        } finally {
          setIsLoadingFile(false);
        }
      } else if (isUrl(file[0]?.url)) {
        // Existing URL, keep it
        fileData = {
          name: file[0]?.name || '',
          size: file[0]?.size || 0,
          url: file[0]?.url || '',
          type: 'application/pdf' // Default type for existing URLs
        };
      }
    }

    return {
      filename: values.filename,
      file: fileData,
      category: values.category
    };
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

  useEffect(() => {
    const loadDocumentData = async () => {
      if (documentData) {
        try {
          const { fileUrls } = await convertFileFromAPI(documentData);

          reset({
            filename: documentData.filename || '',
            category: documentData.category || 'COMPANY_PROFILE',
            file: fileUrls
          });
        } catch (error) {
          console.error('Error loading document data:', error);
          toast.error('Error loading document file');
        }
      }
    };

    loadDocumentData();
  }, [documentData]);

  const onSubmit = handleSubmit(async (values: DocumentFormValues) => {
    try {
      const data = await prepareDataSubmit(values);

      let response;
      if (documentId && documentId !== 'new') {
        // Update existing document
        response = await updateDocument({ id: documentId, ...data });
      } else {
        // Create new document
        response = await createDocument(data);
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
        documentId && documentId !== 'new'
          ? 'Document updated successfully'
          : 'Document created successfully'
      );
      reset();
      router.push('/dashboard/documents');
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
