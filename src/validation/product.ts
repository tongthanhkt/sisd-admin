import { z } from 'zod';

export const productFormSchema = z.object({
  code: z.string().optional(),
  href: z.string().optional(),
  name: z.string().optional(),
  category: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  images: z.object({
    main: z.string().optional(),
    thumbnails: z.array(z.string()).optional()
  }),
  packaging: z.string().optional(),
  advantages: z
    .array(
      z.object({
        id: z.string(),
        value: z.string()
      })
    )
    .optional(),
  technicalSpecifications: z.object({
    standard: z.string().optional(),
    specifications: z
      .array(
        z.object({
          stt: z.number().optional(),
          category: z.string().optional(),
          performance: z.string().optional()
        })
      )
      .optional()
  }),
  transportationAndStorage: z
    .array(
      z.object({
        id: z.string(),
        value: z.string()
      })
    )
    .optional(),
  safetyRegulations: z.object({
    standard: z.string().optional(),
    specifications: z
      .array(
        z.object({
          stt: z.number().optional(),
          performance: z.string().optional()
        })
      )
      .optional(),
    warning: z.string().optional(),
    notes: z.string().optional()
  }),
  isFeatured: z.boolean().optional()
});
