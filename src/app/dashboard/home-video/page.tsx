import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import HomeVideoListingPage from '@/features/home-video/components/home-video-listing';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export const metadata = {
  title: 'Dashboard: Home Videos'
};

export default function Page() {
  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Home Videos'
            description='Manage home videos displayed on the homepage'
          />
          <Link
            href='/dashboard/home-video/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <IconPlus className='mr-2 h-4 w-4' /> Add New
          </Link>
        </div>
        <Separator />
        <Suspense
          fallback={<DataTableSkeleton columnCount={3} filterCount={1} />}
        >
          <NuqsAdapter>
            <HomeVideoListingPage />
          </NuqsAdapter>
        </Suspense>
      </div>
    </PageContainer>
  );
}
