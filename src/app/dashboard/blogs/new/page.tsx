import PageContainer from '@/components/layout/page-container';
import { BlogForm } from '@/features/blogs/components/blog-form';

export const metadata = {
  title: 'Dashboard: New Blog'
};

export default function NewBlogPage() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4 px-1'>
        <BlogForm />
      </div>
    </PageContainer>
  );
}
