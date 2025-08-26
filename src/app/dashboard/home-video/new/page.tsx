import PageContainer from '@/components/layout/page-container';
import { HomeVideoForm } from '@/features/home-video/components/home-video-form';

export const metadata = {
  title: 'Dashboard: New Home Video'
};

export default function NewHomeVideoPage() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4 px-1'>
        <HomeVideoForm />
      </div>
    </PageContainer>
  );
}
