import {
  useCreateBlogMutation,
  useGetBlogQuery,
  useUpdateBlogMutation
} from '@/lib/api/blogs';
import { uploadFile } from '@/lib/upload';
import { isFile, isUrl } from '@/lib/utils';
import { IMutateBlog } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { blogFormSchema, BlogFormValues } from '../utils/form-schema';

export const useBlogForm = (blogId?: string) => {
  const router = useRouter();
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  // RTK Query hooks
  const { data: blogData } = useGetBlogQuery(blogId || '', {
    skip: !blogId || blogId === 'new'
  });
  console.log('🚀 ~ useBlogForm ~ blogData:', blogData);

  const [createBlog] = useCreateBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      descriptions: [],
      href: '',
      date: new Date(),
      isOustanding: false,
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
      contact: ''
    }
  });
  const {
    formState: { errors },
    watch
  } = form;
  const values = watch();
  console.log('🚀 ~ useBlogForm ~ values:', values, errors);

  const prepareDataSubmit = async (
    data: BlogFormValues
  ): Promise<IMutateBlog> => {
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
          (section.images ?? []).map(async (image) => {
            if (isFile(image.file)) {
              const uploadResult = await uploadFile(image.file);
              return {
                src: uploadResult.url || '',
                caption: image.caption || ''
              };
            } else if (isUrl(image.file)) {
              return {
                caption: image.caption || '',
                src: image.file || ''
              };
            }
            return {
              src: '',
              caption: ''
            };
          })
        );

        // Handle contents images
        const processedContents = await Promise.all(
          (section.contents ?? []).map(async (content) => {
            const contentImages = await Promise.all(
              (content.images ?? []).map(async (image) => {
                if (isFile(image.file)) {
                  const uploadResult = await uploadFile(image.file);
                  return {
                    src: uploadResult.url || '',
                    caption: image.caption || ''
                  };
                } else if (isUrl(image.file)) {
                  return {
                    src: image.file || '',
                    caption: image.caption || ''
                  };
                }
                return {
                  src: '',
                  caption: ''
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
                      (content.images ?? []).map(async (image) => {
                        if (isFile(image.file)) {
                          const uploadResult = await uploadFile(image.file);
                          return {
                            src: uploadResult.url || '',

                            caption: image.caption || ''
                          };
                        } else if (isUrl(image.file)) {
                          return {
                            src: image.file || '',

                            caption: image.caption || ''
                          };
                        }
                        return {
                          src: '',
                          caption: ''
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

    const formatDescriptions = data.descriptions.map(
      (description) => description.value
    );

    return {
      title: data.title,
      descriptions: formatDescriptions,
      shortDescription: data.shortDescription,
      slug: data.slug,
      categories: data.categories,
      date: data.date.toISOString(),
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

  // Convert API articleSections images to displayable values for the form
  const convertBlogImagesFromAPI = (articleSections: any[]) => {
    return (articleSections ?? []).map((section) => ({
      ...section,
      images: (section.images ?? []).map((img: any) => ({
        file: img.src,
        caption: img.caption || ''
      })),
      contents: (section.contents ?? []).map((content: any) => ({
        ...content,
        images: (content.images ?? []).map((img: any) => ({
          file: img.src,
          caption: img.caption || ''
        }))
      })),
      subHeadline: (section.subHeadline ?? []).map((sub: any) => ({
        ...sub,
        contents: (sub.contents ?? []).map((content: any) => ({
          ...content,
          images: (content.images ?? []).map((img: any) => ({
            file: img.src,
            caption: img.caption || ''
          }))
        }))
      }))
    }));
  };

  useEffect(() => {
    const loadBlogData = async () => {
      if (blogData) {
        try {
          // Map images for articleSections
          const mappedArticleSections = convertBlogImagesFromAPI(
            blogData.articleSections
          );
          const bannerFiles = blogData.banner ? [blogData.banner] : [];
          const thumbnailFiles = blogData.thumbnail ? [blogData.thumbnail] : [];

          form.reset({
            title: blogData.title || '',
            descriptions:
              blogData.descriptions?.map((d: string) => ({
                value: d,
                id: Math.random().toString(36).substring(2, 15)
              })) || [],
            href: blogData.href || '',
            date: blogData.date ? new Date(blogData.date) : new Date(),
            isOustanding: blogData.isOustanding || false,
            slug: blogData.slug || '',
            categories: blogData.categories || [],
            relatedPosts: blogData.relatedPosts || [],
            articleSections: mappedArticleSections,
            relatedProducts: blogData.relatedProducts || [],
            showArrowDesktop: blogData.showArrowDesktop || false,
            isVertical: blogData.isVertical || false,
            banner: bannerFiles,
            thumbnail: thumbnailFiles,
            shortDescription: blogData.shortDescription || '',
            summary: blogData.summary || '',
            contact: blogData.contact || ''
          });
        } catch (error) {
          console.error('Error loading blog data:', error);
          toast.error('Error loading blog images');
        }
      }
    };

    loadBlogData();
  }, [blogData]);

  const onSubmit = async (data: BlogFormValues) => {
    try {
      const preparedData = await prepareDataSubmit(data);
      console.log('🚀 ~ onSubmit ~ preparedData:', preparedData);

      let response;
      if (blogId && blogId !== 'new') {
        // Update existing blog
        response = await updateBlog({ id: blogId, ...preparedData });
      } else {
        // Create new blog
        response = await createBlog(preparedData);
      }

      if ('error' in response && response.error) {
        const errorMessage =
          'data' in response.error && response.error.data
            ? (response.error.data as any)?.message
            : 'error' in response.error
              ? response.error.error
              : 'Something went wrong';
        toast.error(errorMessage);
        return;
      }

      toast.success(
        blogId && blogId !== 'new'
          ? 'Blog updated successfully'
          : 'Blog created successfully'
      );
      form.reset();
      router.push('/dashboard/blogs');
    } catch (error) {
      console.error('🚀 ~ onSubmit error:', error);
      toast.error('An error occurred while saving the blog');
    }
  };

  return { form, onSubmit, isLoadingImages };
};
