import { notFound } from 'next/navigation';
import { DocumentForm } from './document-form';

type DocumentViewPageProps = {
  documentId: string;
};

export default async function DocumentViewPage({
  documentId
}: DocumentViewPageProps) {
  let pageTitle = 'Create Document';

  if (documentId !== 'new') {
    try {
      pageTitle = 'Edit Document';
    } catch (error) {
      console.error('Error fetching blog:', error);
      notFound();
    }
  }

  return <DocumentForm pageTitle={pageTitle} documentId={documentId} />;
}
