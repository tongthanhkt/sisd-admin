import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import BlogViewPage from '@/features/blogs/components/blog-view-page';

export const metadata = {
  title: 'Dashboard: Blog View'
};

export default function Page({ params }: any) {
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <BlogViewPage blogId={params.blogId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
