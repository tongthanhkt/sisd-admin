import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { FAQForm } from '@/features/faq/components/faq-form';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: FAQ Edit'
};

export default function Page({ params }: any) {
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <FAQForm faqId={params.id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
