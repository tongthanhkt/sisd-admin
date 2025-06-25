import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { BlogForm } from '@/features/blogs/components/blog-form';
import { cn } from '@/lib/utils';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard: New Blog'
};

export default function NewBlogPage() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4 px-1'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Tạo bài viết mới'
            description='Thêm bài viết mới vào hệ thống'
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
        <BlogForm />
      </div>
    </PageContainer>
  );
}
