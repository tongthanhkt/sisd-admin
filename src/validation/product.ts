import { z } from 'zod';

export const productFormSchema = z.object({
  code: z.string().min(1, { message: 'Product code is required' }),
  name: z
    .string()
    .min(1, { message: 'Product name is required' })
    .trim()
    .refine((val) => val.length > 0, {
      message: 'Product name is required'
    }),
  category: z.string().optional(),
  shortDescription: z
    .string()
    .min(1, { message: 'Short description is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  thumbnail: z
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
      { message: 'All thumbnails must be files or valid URLs' }
    ),
  images: z
    .array(
      z.object({
        file: z.any(),
        caption: z.string().optional()
      })
    )
    .min(1, { message: 'Images are required' })
    .refine(
      (arr) =>
        typeof window === 'undefined' ||
        arr.every(
          (f) =>
            f.file instanceof File ||
            (typeof f.file === 'string' &&
              (f.file.startsWith('http') || f.file.startsWith('/')))
        ),
      { message: 'All images must be files or valid URLs' }
    ),
  packaging: z.string().min(1, { message: 'Packaging is required' }),
  advantages: z
    .array(
      z.object({
        id: z.string(),
        value: z.string().min(1, { message: 'Advantage is required' })
      })
    )
    .min(1, { message: 'At least one advantage is required' }),
  technicalSpecifications: z.object({
    standard: z.string().min(1, { message: 'Standard is required' }),
    specifications: z
      .array(
        z.object({
          category: z.string().min(1, { message: 'Category is required' }),
          performance: z
            .string()
            .min(1, { message: 'Performance is required' }),
          id: z.string()
        })
      )
      .min(1, { message: 'At least one specification is required' })
  }),
  transportationAndStorage: z
    .array(
      z.object({
        id: z.string(),
        value: z
          .string()
          .min(1, { message: 'Transportation and storage is required' })
      })
    )
    .min(1, { message: 'At least one transportation and storage is required' }),
  safetyRegulations: z.object({
    warning: z.string().min(1, { message: 'Warning is required' }),
    notes: z.string().optional()
  })
});
