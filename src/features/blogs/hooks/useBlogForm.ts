import { useForm } from 'react-hook-form';
import { blogFormSchema, BlogFormValues } from '../utils/form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { IMutateBlog } from '@/types';
import { uploadFile } from '@/lib/upload';
import { isFile, isUrl } from '@/lib/utils';
import { toast } from 'sonner';

export const useBlogForm = (blogId?: string) => {
  const router = useRouter();
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      image: '',
      content: '',
      descriptions: [],
      href: '',
      date: new Date(),
      isOustanding: false,
      imageSrc: '',
      imageAlt: '',
      category: '',
      slug: '',
      categories: [],
      relatedPosts: [],
      articleSections: [],
      relatedProducts: [],
      showArrowDesktop: false,
      isVertical: false,
      banner: [],
      thumbnail: [],
      shortDescription: '',
      summary: '',
      contact: '',
      relatedProduct: []
    }
  });

  const prepareDataSubmit = async (
    data: BlogFormValues
  ): Promise<IMutateBlog> => {
    // Handle image upload
    let imageUrl = '';
    if (data.image && data.image.length > 0) {
      if (isFile(data.image[0])) {
        // New file uploaded
        const uploadResult = await uploadFile(data.image[0]);
        imageUrl = uploadResult.url || '';
      } else if (isUrl(data.image[0])) {
        // Existing URL, keep it
        imageUrl = data.image[0];
      }
    }

    // Handle thumbnail upload
    let thumbnailUrl = '';
    if (data.thumbnail && data.thumbnail.length > 0) {
      if (isFile(data.thumbnail[0])) {
        const uploadResult = await uploadFile(data.thumbnail[0]);
        thumbnailUrl = uploadResult.url || '';
      } else if (isUrl(data.thumbnail[0])) {
        thumbnailUrl = data.thumbnail[0];
      }
    }

    // Handle banner upload
    let bannerUrl = '';
    if (data.banner && data.banner.length > 0) {
      if (isFile(data.banner[0])) {
        const uploadResult = await uploadFile(data.banner[0]);
        bannerUrl = uploadResult.url || '';
      } else if (isUrl(data.banner[0])) {
        bannerUrl = data.banner[0];
      }
    }

    // Handle article sections images
    const processedArticleSections = await Promise.all(
      data.articleSections.map(async (section) => {
        // Handle section images
        const sectionImages = await Promise.all(
          section.images.map(async (image) => {
            if (isFile(image)) {
              const uploadResult = await uploadFile(image);
              return {
                src: uploadResult.url || '',
                id: Math.random().toString(36).substring(2, 15)
              };
            } else if (isUrl(image)) {
              return {
                src: image,
                id: Math.random().toString(36).substring(2, 15)
              };
            }
            return { src: '', id: Math.random().toString(36).substring(2, 15) };
          })
        );

        // Handle contents images
        const processedContents = await Promise.all(
          section.contents.map(async (content) => {
            const contentImages = await Promise.all(
              content.images.map(async (image) => {
                if (isFile(image)) {
                  const uploadResult = await uploadFile(image);
                  return {
                    src: uploadResult.url || '',
                    id: Math.random().toString(36).substring(2, 15)
                  };
                } else if (isUrl(image)) {
                  return {
                    src: image,
                    id: Math.random().toString(36).substring(2, 15)
                  };
                }
                return {
                  src: '',
                  id: Math.random().toString(36).substring(2, 15)
                };
              })
            );

            return {
              ...content,
              images: contentImages
            };
          })
        );

        // Handle subHeadline images if exists
        const processedSubHeadlines = section.subHeadline
          ? await Promise.all(
              section.subHeadline.map(async (subHeadline) => {
                const processedSubContents = await Promise.all(
                  subHeadline.contents.map(async (content) => {
                    const contentImages = await Promise.all(
                      content.images.map(async (image) => {
                        if (isFile(image)) {
                          const uploadResult = await uploadFile(image);
                          return {
                            src: uploadResult.url || '',
                            id: Math.random().toString(36).substring(2, 15)
                          };
                        } else if (isUrl(image)) {
                          return {
                            src: image,
                            id: Math.random().toString(36).substring(2, 15)
                          };
                        }
                        return {
                          src: '',
                          id: Math.random().toString(36).substring(2, 15)
                        };
                      })
                    );

                    return {
                      ...content,
                      images: contentImages
                    };
                  })
                );

                return {
                  ...subHeadline,
                  contents: processedSubContents
                };
              })
            )
          : undefined;

        return {
          ...section,
          images: sectionImages,
          contents: processedContents,
          subHeadline: processedSubHeadlines
        };
      })
    );

    return {
      title: data.title,
      descriptions: data.descriptions,
      shortDescription: data.shortDescription,
      slug: data.slug,
      categories: data.categories,
      date: data.date.toISOString(),
      image: imageUrl,
      articleSections: processedArticleSections,
      relatedProducts: data.relatedProducts || [],
      relatedPosts: data.relatedPosts,
      showArrowDesktop: data.showArrowDesktop,
      isVertical: data.isVertical,
      thumbnail: thumbnailUrl,
      banner: bannerUrl,
      isOustanding: data.isOustanding,
      href: data.href,
      summary: data.summary || '',
      contact: data.contact || ''
    };
  };

  const onSubmit = async (data: BlogFormValues) => {
    try {
      const preparedData = await prepareDataSubmit(data);

      if (blogId) {
        await fetch(`/api/blogs/${blogId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(preparedData)
        });
        toast.success('Blog updated successfully');
      } else {
        await fetch('/api/blogs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(preparedData)
        });
        toast.success('Blog created successfully');
      }

      router.push('/dashboard/blogs');
      router.refresh();
    } catch (error) {
      console.error('Error submitting blog:', error);
      toast.error('An error occurred while saving the blog');
    }
  };

  return { form, onSubmit };
};
