import { notFound } from 'next/navigation';
import { IBlog } from '@/models/Blog';
import { BlogForm } from './blog-form';

type BlogViewPageProps = {
  blogId: string;
};

export default async function BlogViewPage({ blogId }: BlogViewPageProps) {
  let blog: IBlog | null = null;
  let pageTitle = 'Create Blog';

  if (blogId !== 'new') {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${blogId}`,
        {
          cache: 'no-store'
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          notFound();
        }
        throw new Error('Failed to fetch blog');
      }

      blog = await response.json();
      pageTitle = 'Edit Blog';
    } catch (error) {
      console.error('Error fetching blog:', error);
      notFound();
    }
  }

  return <BlogForm pageTitle={pageTitle} blogId={blogId} />;
}
