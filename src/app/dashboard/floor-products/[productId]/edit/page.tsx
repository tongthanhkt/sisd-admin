import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { FloorProductForm } from '@/features/floor-products/components/floor-product-form';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Floor Product Edit'
};

export default function Page({ params }: any) {
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <FloorProductForm productId={params.productId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
