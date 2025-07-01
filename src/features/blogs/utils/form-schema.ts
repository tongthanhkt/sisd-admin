import * as z from 'zod';

const articleSectionImageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional()
});

const articleSectionContentSchema = z.object({
  content: z.string(),
  images: z.array(articleSectionImageSchema).optional()
});

const articleSectionSubHeadlineSchema = z.object({
  title: z.string(),
  contents: z.array(articleSectionContentSchema),
  images: z.array(articleSectionImageSchema).optional()
});

const articleSectionSchema = z.object({
  headline: z.string().optional(),
  headline2: z.string().optional(),
  contents: z.array(articleSectionContentSchema),
  images: z.array(articleSectionImageSchema).optional(),
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
  date: z.string(),
  image: z.any(),
  content: z.string(),
  relatedPosts: z
    .array(
      z.object({
        title: z.string(),
        category: z.string(),
        slug: z.string()
      })
    )
    .default([]),
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
    )
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;
