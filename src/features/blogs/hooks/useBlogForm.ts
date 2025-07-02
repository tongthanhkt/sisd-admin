import { useForm } from 'react-hook-form';
import { blogFormSchema, BlogFormValues } from '../utils/form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { IMutateBlog } from '@/types';
import { uploadFile } from '@/lib/upload';
import { isFile, isUrl } from '@/lib/utils';
import { toast } from 'sonner';
import {
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useGetBlogQuery
} from '@/lib/api/blogs';
import { IBlog } from '@/models/Blog';
import { useEffect, useState } from 'react';

export const useBlogForm = (blogId?: string) => {
  const router = useRouter();
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  // RTK Query hooks
  const { data: blogData } = useGetBlogQuery(blogId || '', {
    skip: !blogId || blogId === 'new'
  });

  const [createBlog] = useCreateBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();

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
  const {
    formState: { errors },
    watch
  } = form;
  const values = watch();
  console.log('🚀 ~ useBlogForm ~ values:', values, errors);

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
        console.log('🚀 ~ data.articleSections.map ~ section:', section);
        // Handle section images
        const sectionImages = await Promise.all(
          (section.images ?? []).map(async (image) => {
            console.log('🚀 ~ imssssssage:', image);
            if (isFile(image.file)) {
              const uploadResult = await uploadFile(image.file);
              return {
                src: uploadResult.url || '',
                caption: image.caption || ''
              };
            } else if (isUrl(image.src)) {
              return {
                caption: image.caption || '',
                src: image.src || ''
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
                } else if (isUrl(image.src)) {
                  return {
                    src: image.src || '',
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
                        } else if (isUrl(image.src)) {
                          return {
                            src: image.src || '',

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

  // Convert API image URLs to displayable values (no fetch)
  const convertImagesFromAPI = async (blogData: IBlog) => {
    setIsLoadingImages(true);
    try {
      const imageFiles: string[] = [];
      const thumbnailFiles: string[] = [];
      const bannerFiles: string[] = [];

      // Handle main image
      if (blogData.image) {
        imageFiles.push(blogData.image);
      }

      // Handle thumbnail (assuming it's stored in imageSrc or similar field)
      if (blogData.imageSrc) {
        thumbnailFiles.push(blogData.imageSrc);
      }

      // Handle banner (you might need to adjust this based on your actual data structure)
      if (blogData.image) {
        bannerFiles.push(blogData.image);
      }

      return { imageFiles, thumbnailFiles, bannerFiles };
    } finally {
      setIsLoadingImages(false);
    }
  };

  useEffect(() => {
    const loadBlogData = async () => {
      if (blogData) {
        try {
          const { imageFiles, thumbnailFiles, bannerFiles } =
            await convertImagesFromAPI(blogData);

          form.reset({
            title: blogData.title || '',
            image: imageFiles,
            content: Array.isArray(blogData.content)
              ? blogData.content.join('\n')
              : blogData.content || '',
            descriptions: blogData.description
              ? [{ value: blogData.description }]
              : [],
            href: blogData.href || '',
            date: new Date(blogData.date || Date.now()),
            isOustanding: blogData.isOustanding || false,
            imageSrc: blogData.imageSrc || '',
            imageAlt: blogData.imageAlt || '',
            category: blogData.category || '',
            slug: blogData.slug || '',
            categories: blogData.categories || [],
            relatedPosts: blogData.relatedPosts || [],
            articleSections: blogData.articleSections || [],
            relatedProducts: blogData.relatedProducts || [],
            showArrowDesktop: blogData.showArrowDesktop || false,
            isVertical: blogData.isVertical || false,
            banner: bannerFiles,
            thumbnail: thumbnailFiles,
            shortDescription: blogData.description || '',
            summary: blogData.description || '',
            contact: '',
            relatedProduct:
              blogData.relatedProducts?.map((product) => product.toString()) ||
              []
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
