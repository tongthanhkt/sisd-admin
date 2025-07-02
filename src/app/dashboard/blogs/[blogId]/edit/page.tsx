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
      <Suspense fallback={<FormCardSkeleton />}>
        <BlogViewPage blogId={params.blogId} />
      </Suspense>
    </PageContainer>
  );
}
