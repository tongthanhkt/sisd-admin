import * as z from 'zod';

export const documentFormSchema = z.object({
  filename: z.string().min(1, 'Title is required'),

  category: z.string().min(1, 'Category is required'),

  file: z
    .array(z.any())
    .min(1, { message: 'Thumbnail is required' })
    .refine(
      (arr) =>
        typeof window === 'undefined' ||
        arr.every(
          (f) =>
            f instanceof File ||
            (typeof f === 'object' &&
              f !== null &&
              'file' in f &&
              f.file instanceof File) ||
            (typeof f === 'string' &&
              (f.startsWith('http') || f.startsWith('/')))
        ),
      { message: 'All files must be files or valid URLs' }
    )
});

export type DocumentFormValues = z.infer<typeof documentFormSchema>;
