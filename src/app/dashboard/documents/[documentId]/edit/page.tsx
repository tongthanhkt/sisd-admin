import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import DocumentViewPage from '@/features/documents/components/document-view-page';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Edit Document'
};

export default function Page({ params }: any) {
  return (
    <PageContainer>
      <Suspense fallback={<FormCardSkeleton />}>
        <DocumentViewPage documentId={params.documentId} />
      </Suspense>
    </PageContainer>
  );
}
