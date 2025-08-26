import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { HomeVideoForm } from '@/features/home-video/components/home-video-form';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Video Home Edit'
};

export default function Page({ params }: any) {
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <HomeVideoForm videoId={params.videoId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
