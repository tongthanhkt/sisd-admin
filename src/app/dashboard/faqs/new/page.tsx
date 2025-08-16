import PageContainer from '@/components/layout/page-container';
import { FAQForm } from '@/features/faq/components/faq-form';

export const metadata = {
  title: 'Dashboard: New FAQ'
};

export default function NewFAQPage() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4 px-1'>
        <FAQForm />
      </div>
    </PageContainer>
  );
}
