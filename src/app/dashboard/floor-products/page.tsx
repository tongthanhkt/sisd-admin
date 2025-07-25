import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import CatalogListingPage from '@/features/floor-products/components/catalog-listing';
import FloorProductListingPage from '@/features/floor-products/components/floor-product-listing';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';

import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Floor Products'
};

const page = () => {
  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading title='Sản phẩm sàn' description='Danh sách sản phẩm sàn.' />
          <Link
            href='/dashboard/floor-products/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <IconPlus className='mr-2 h-4 w-4' /> Add New
          </Link>
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={0} />
          }
        >
          <CatalogListingPage />
          <FloorProductListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default page;
