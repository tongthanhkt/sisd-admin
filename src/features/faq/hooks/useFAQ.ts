import {
  useCreateFaqMutation,
  useGetFaqQuery,
  useUpdateFaqMutation
} from '@/lib/api/faq';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { faqFormSchema, FAQFormValues } from '../utils/form-schema';

export const useFAQ = ({ faqId }: { faqId?: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [createFaq] = useCreateFaqMutation();
  const [updateFaq] = useUpdateFaqMutation();
  const { data: faqData } = useGetFaqQuery(faqId || '', {
    skip: !faqId || faqId === 'new'
  });

  const methods = useForm<FAQFormValues>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      id: '',
      body: [
        {
          id: Math.random().toString(),
          question: '',
          contents: [
            {
              id: Math.random().toString(),
              value: ''
            }
          ]
        }
      ]
    }
  });

  const { handleSubmit, reset } = methods;

  const prepareDataSubmit = (data: FAQFormValues) => {
    return {
      id: data.id,
      body: data.body.map((item) => ({
        question: item.question,
        contents: item.contents.map((content) => content.value)
      }))
    };
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      const formattedData = prepareDataSubmit(data);
      let response;
      if (faqId && faqId !== 'new') {
        // Update existing faq
        response = await updateFaq({
          id: faqId,
          data: { body: formattedData.body }
        });
      } else {
        // Create new faq
        response = await createFaq(formattedData);
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
        faqId && faqId !== 'new'
          ? 'FAQ updated successfully'
          : 'FAQ created successfully'
      );
      reset();
    } catch (error) {
      toast.error('An error occurred while saving the faq');
    } finally {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    if (faqData) {
      reset({
        id: faqData.id,
        body: faqData.body.map((item) => ({
          id: Math.random().toString(),
          question: item.question,
          contents: item.contents.map((content) => ({
            id: Math.random().toString(),
            value: content
          }))
        }))
      });
    }
  }, [faqData, reset]);

  return { methods, onSubmit, isLoading };
};
