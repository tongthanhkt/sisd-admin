import { notFound } from 'next/navigation';
import { BlogForm } from './blog-form';

type BlogViewPageProps = {
  blogId: string;
};

export default async function BlogViewPage({ blogId }: BlogViewPageProps) {
  let pageTitle = 'Create Blog';

  if (blogId !== 'new') {
    try {
      pageTitle = 'Edit Blog';
    } catch (error) {
      console.error('Error fetching blog:', error);
      notFound();
    }
  }

  return <BlogForm pageTitle={pageTitle} blogId={blogId} />;
}
