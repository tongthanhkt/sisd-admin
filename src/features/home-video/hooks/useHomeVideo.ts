import {
  useCreateHomeVideoMutation,
  useGetHomeVideoByIdQuery,
  useUpdateHomeVideoMutation
} from '@/lib/api/videoApi';
import { uploadVideo } from '@/lib/upload';
import { isFile, isUrl } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { homeVideoFormSchema } from '../utils/form-schema';

export type HomeVideoFormValues = z.infer<typeof homeVideoFormSchema>;
export type FieldName = keyof HomeVideoFormValues;

export const useHomeVideo = ({ videoId }: { videoId?: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<HomeVideoFormValues>({
    resolver: zodResolver(homeVideoFormSchema),
    mode: 'onChange',
    defaultValues: {
      video: [],
      name: ''
    }
  });

  const router = useRouter();

  const {
    formState: { errors },
    reset,
    handleSubmit
  } = methods;

  const [createHomeVideo] = useCreateHomeVideoMutation();
  const [updateHomeVideo] = useUpdateHomeVideoMutation();

  const { data: homeVideoData } = useGetHomeVideoByIdQuery(videoId || '', {
    skip: !videoId
  });

  const prepareDataSubmit = async (
    values: HomeVideoFormValues
  ): Promise<{ name: string; videoId: string }> => {
    const { video, name } = values;

    try {
      let videoId = '';

      if (video && video.length > 0) {
        const videoFile = video[0];
        if (isFile(videoFile)) {
          const uploadResult = await uploadVideo(videoFile);
          videoId = uploadResult?.id || '';
        } else if (isUrl(videoFile)) {
          videoId = videoFile;
        }
      }

      return {
        name,
        videoId
      };
    } catch (error) {
      console.error('Error preparing data submit:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadHomeVideoData = async () => {
      if (homeVideoData) {
        try {
          reset({
            video: homeVideoData.video ? [homeVideoData.video.url] : [],
            name: homeVideoData.name
          });
        } catch (error) {
          console.error('Error loading home video data:', error);
          toast.error('Error loading home video data');
        }
      }
    };

    loadHomeVideoData();
  }, [homeVideoData, reset]);

  const onSubmit = handleSubmit(async (values: HomeVideoFormValues) => {
    try {
      setIsLoading(true);
      let response;

      if (videoId && videoId !== 'new') {
        response = await updateHomeVideo({
          id: videoId,
          name: values.name
        });
      } else {
        const data = await prepareDataSubmit(values);
        response = await createHomeVideo(data);
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
        videoId && videoId !== 'new'
          ? 'Home video updated successfully'
          : 'Home video created successfully'
      );
      reset();
      router.push('/dashboard/home-video');
    } catch (error) {
      console.error('🚀 ~ onSubmit error:', error);
      toast.error('An error occurred while saving the home video');
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
