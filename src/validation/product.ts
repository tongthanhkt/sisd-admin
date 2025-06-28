import { z } from 'zod';

export const productFormSchema = z.object({
  code: z.string().min(1, { message: 'Product code is required' }),
  href: z.string().optional(),
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
  image: z.string().optional(),
  images: z.object({
    main: z.string().optional(),
    thumbnails: z.array(z.string()).optional()
  }),
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
          performance: z.string().min(1, { message: 'Performance is required' })
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
  }),
  isFeatured: z.boolean().optional(),
  relatedBlogs: z
    .array(z.string())
    .min(1, { message: 'At least one blog is required' }),
  relatedProduct: z
    .array(z.string())
    .min(1, { message: 'At least one product is required' })
});
