import * as z from 'zod';

export const faqFormSchema = z.object({
  id: z.string().min(1, 'id is required'),
  body: z
    .array(
      z.object({
        id: z.string(),
        question: z.string().min(1, 'question is required'),
        contents: z
          .array(
            z.object({
              id: z.string(),
              value: z.string().min(1, { message: 'Content is required' })
            })
          )
          .min(1, { message: 'At least one content is required' })
      })
    )
    .min(1, 'At least one content is required')
});

export type FAQFormValues = z.infer<typeof faqFormSchema>;
