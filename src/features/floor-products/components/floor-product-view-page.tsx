import { notFound } from 'next/navigation';
import { FloorProductForm } from './floor-product-form';

type DocumentViewPageProps = {
  productId: string;
};

export default async function DocumentViewPage({
  productId
}: DocumentViewPageProps) {
  let pageTitle = 'Create Floor Product';

  if (productId !== 'new') {
    try {
      pageTitle = 'Edit Floor Product';
    } catch (error) {
      console.error('Error fetching product:', error);
      notFound();
    }
  }

  return <FloorProductForm pageTitle={pageTitle} productId={productId} />;
}
