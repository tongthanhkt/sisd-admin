import * as z from 'zod';

const fileType =
  typeof window !== 'undefined'
    ? z.union([z.string(), z.instanceof(File)])
    : z.string();

const articleSectionImageSchema = z
  .array(
    z.object({
      file: fileType,
      caption: z.string().optional()
    })
  )
  .refine(
    (arr) =>
      typeof window === 'undefined' ||
      arr.every(
        (img) =>
          (typeof img.file === 'string' &&
            (img.file.startsWith('http') || img.file.startsWith('/'))) ||
          img.file instanceof File
      ),
    { message: 'All images must be files or valid URLs' }
  );

const articleSectionContentSchema = z.object({
  content: z.string(),
  images: articleSectionImageSchema.optional().default([])
});

const articleSectionSubHeadlineSchema = z.object({
  title: z.string(),
  subTitle: z.string(),
  contents: z.array(articleSectionContentSchema)
  // images: articleSectionImageSchema
});

const articleSectionSchema = z.object({
  id: z.string().optional(),
  headline: z.string().optional(),
  headline2: z.string().optional(),
  contents: z.array(articleSectionContentSchema),
  images: articleSectionImageSchema,
  subHeadline: z.array(articleSectionSubHeadlineSchema).optional()
});

export const blogFormSchema = z.object({
  isOustanding: z.boolean().default(false),
  href: z.string().min(1, 'Href is required'),
  title: z.string().min(1, 'Title is required'),
  descriptions: z
    .array(
      z.object({
        id: z.string().optional(),
        value: z.string().min(1, 'Description is required')
      })
    )
    .min(1, 'At least one description is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  slug: z.string(),
  categories: z.array(z.string()).min(1, 'Categories is required'),
  date: z.date(),
  articleSections: z
    .array(articleSectionSchema)
    .min(1, 'Article sections is required'),
  showArrowDesktop: z.boolean().default(false),
  isVertical: z.boolean().default(false),
  thumbnail: z
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
      { message: 'All thumbnails must be files or valid URLs' }
    ),
  banner: z
    .array(z.any())
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
      { message: 'All banners must be files or valid URLs' }
    ),
  summary: z.string().optional(),
  contact: z.string().optional(),
  relatedPosts: z
    .array(z.string())
    .min(1, { message: 'At least one blog is required' }),
  relatedProducts: z
    .array(z.string())
    .min(1, { message: 'At least one product is required' })
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;
