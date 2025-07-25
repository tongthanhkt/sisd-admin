import * as z from 'zod';

export const floorProductFormSchema = z.object({
  image_url: z
    .array(z.any())
    .min(1, { message: 'Thumbnail is required' })
    .refine(
      (arr) =>
        typeof window === 'undefined' ||
        arr.every(
          (f) =>
            f instanceof File ||
            (typeof f === 'string' &&
              (f.startsWith('http') || f.startsWith('/')))
        ),
      { message: 'All image must be files or valid URLs' }
    ),
  color_image_url: z
    .array(z.any())
    .min(1, { message: 'Thumbnail is required' })
    .refine(
      (arr) =>
        typeof window === 'undefined' ||
        arr.every(
          (f) =>
            f instanceof File ||
            (typeof f === 'string' &&
              (f.startsWith('http') || f.startsWith('/')))
        ),
      { message: 'All color image must be files or valid URLs' }
    ),
  color_name: z.string().min(1, 'Color name is required'),
  content: z.string().min(1, 'Content is required'),
  catalog_id: z.string().min(1, 'Catalog is required')
});

export type FloorProductFormValues = z.infer<typeof floorProductFormSchema>;
