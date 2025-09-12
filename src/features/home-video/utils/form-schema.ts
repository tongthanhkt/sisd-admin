import * as z from 'zod';

export const homeVideoFormSchema = z.object({
  video: z
    .array(z.any())
    .min(1, { message: 'Video is required' })
    .refine(
      (arr) =>
        typeof window === 'undefined' ||
        arr.every(
          (f) =>
            f instanceof File ||
            (typeof f === 'string' &&
              (f.startsWith('http') || f.startsWith('/')))
        ),
      { message: 'All video must be files or valid URLs' }
    ),
  name: z.string().min(1, 'Name is required'),
  page: z.string().min(1, 'Page is required')
});

export type HomeVideoFormValues = z.infer<typeof homeVideoFormSchema>;
