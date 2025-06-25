import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { BlogForm } from '@/features/blogs/components/blog-form';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import BlogViewPage from '@/features/blogs/components/blog-view-page';

export const metadata = {
  title: 'Dashboard: Edit Blog'
};

type PageProps = {
  params: { blogId: string };
};

export default function Page({ params }: PageProps) {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4 px-1'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Chỉnh sửa bài viết'
            description='Cập nhật thông tin bài viết'
          />
          <Link
            href='/dashboard/blogs'
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'text-xs md:text-sm'
            )}
          >
            <IconArrowLeft className='mr-2 h-4 w-4' /> Quay lại
          </Link>
        </div>
        <Separator />
        <Suspense fallback={<FormCardSkeleton />}>
          <BlogViewPage blogId={params.blogId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
