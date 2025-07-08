import * as z from 'zod';

export const documentFormSchema = z.object({
  filename: z.string().min(1, 'Title is required'),

  category: z.string().min(1, 'Category is required'),

  file: z
    .array(
      z.union([
        z.instanceof(File),
        z.object({
          name: z.string(),
          size: z.number(),
          type: z.string(),
          url: z.string().optional(),
          preview: z.string().optional()
        })
      ])
    )
    .min(1, { message: 'Thumbnail is required' })
});

export type DocumentFormValues = z.infer<typeof documentFormSchema>;
