import PageContainer from '@/components/layout/page-container';
import { DocumentForm } from '@/features/documents/components/document-form';

export const metadata = {
  title: 'Dashboard: New Document'
};

export default function NewDocumentPage() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4 px-1'>
        <DocumentForm />
      </div>
    </PageContainer>
  );
}
