import * as z from 'zod';

const articleSectionImageSchema = z
  .array(z.any())
  .refine(
    (arr) =>
      typeof window === 'undefined' ||
      arr.every(
        (f) =>
          f instanceof File ||
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
  contents: z.array(articleSectionContentSchema),
  images: articleSectionImageSchema
});

const articleSectionSchema = z.object({
  headline: z.string().optional(),
  headline2: z.string().optional(),
  contents: z.array(articleSectionContentSchema),
  images: articleSectionImageSchema,
  subHeadline: z.array(articleSectionSubHeadlineSchema).optional()
});

export const blogFormSchema = z.object({
  isOustanding: z.boolean().default(false),
  href: z.string(),
  imageSrc: z.string(),
  imageAlt: z.string(),
  category: z.string(),
  categoryColor: z.string(),
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  description: z.string().min(1, 'Mô tả không được để trống'),
  shortDescription: z.string().min(1, 'Mô tả không được để trống'),
  slug: z.string().min(1, 'Slug không được để trống'),
  categories: z.array(z.string()).default([]),
  date: z.date(),
  image: z.any(),
  content: z.string(),
  articleSections: z.array(articleSectionSchema).default([]),
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
            (typeof f === 'string' &&
              (f.startsWith('http') || f.startsWith('/')))
        ),
      { message: 'All thumbnails must be files or valid URLs' }
    ),
  banner: z
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
