import { useForm } from 'react-hook-form';
import { homeVideoFormSchema } from '../utils/form-schema';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export type HomeVideoFormValues = z.infer<typeof homeVideoFormSchema>;
export const useHomeVideo = ({ videoId }: { videoId?: string }) => {
  const methods = useForm<HomeVideoFormValues>({
    resolver: zodResolver(homeVideoFormSchema),
    mode: 'onChange',
    defaultValues: {
      video_url: [],
      name: ''
    }
  });
  const { control, setValue, handleSubmit } = methods;

  const onSubmit = handleSubmit((data) => console.log(data));

  return { methods, onSubmit };
};
