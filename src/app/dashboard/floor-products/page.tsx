import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import FloorProductListingPage from '@/features/floor-products/components/floor-product-listing';

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
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={0} />
          }
        >
          <FloorProductListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default page;
