import { useForm } from 'react-hook-form';
import { blogFormSchema, BlogFormValues } from '../utils/form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

export const useBlogForm = (blogId?: string) => {
  const router = useRouter();
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      image: '',
      content: '',
      description: [],
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

  const prepareData = (data: BlogFormValues) => {
    return {
      ...data,
      articleSections: data.articleSections.map((section) => ({
        ...section,
        images: section.images.map((image) => image.file)
      }))
    };
  };

  const onSubmit = async (data: BlogFormValues) => {
    if (blogId) {
      await fetch(`/api/blogs/${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    } else {
      await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    }
    router.push('/dashboard/blogs');
    router.refresh();
  };

  return { form, onSubmit };
};
