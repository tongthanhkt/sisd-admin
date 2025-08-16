import { useForm } from 'react-hook-form';
import { faqFormSchema, FAQFormValues } from '../utils/form-schema';
import { zodResolver } from '@hookform/resolvers/zod';

export const useFAQ = () => {
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

  const { handleSubmit } = methods;
  const onSubmit = handleSubmit(async (data) => {
    // TODO: Implement FAQ submission logic
    console.log(data); // eslint-disable-line no-console
  });

  return { methods, onSubmit };
};
