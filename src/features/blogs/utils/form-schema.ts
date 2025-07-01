import * as z from 'zod';

const articleSectionImageSchema = z
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
          (typeof f === 'string' && (f.startsWith('http') || f.startsWith('/')))
      ),
    { message: 'All images must be files or valid URLs' }
  );

const articleSectionContentSchema = z.object({
  content: z.string(),
  images: articleSectionImageSchema
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
  imageSrc: z.string(),
  imageAlt: z.string(),
  category: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  slug: z.string().min(1, 'Slug is required'),
  categories: z.array(z.string()).min(1, 'Categories is required'),
  date: z.date(),
  image: z.any(),
  content: z.string(),
  articleSections: z
    .array(articleSectionSchema)
    .min(1, 'Article sections is required'),
  relatedProducts: z.array(z.any()).optional().default([]),
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
    .min(1, { message: 'Banner is required' })
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
  relatedProduct: z
    .array(z.string())
    .min(1, { message: 'At least one product is required' })
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;
