import PageContainer from '@/components/layout/page-container';
import { FloorProductForm } from '@/features/floor-products/components/floor-product-form';

export const metadata = {
  title: 'Dashboard: New Floor Product'
};

export default function NewFloorProductPage() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4 px-1'>
        <FloorProductForm />
      </div>
    </PageContainer>
  );
}
