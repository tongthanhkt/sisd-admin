import { notFound } from 'next/navigation';
import ProductForm from './product-form';
import { Product } from '@/constants/data';

type TProductViewPageProps = {
  productId: string;
};

export default async function ProductViewPage({
  productId
}: TProductViewPageProps) {
  let product: Product | null = null;
  let pageTitle = 'Create New Product';

  if (productId !== 'new') {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
        {
          cache: 'no-store'
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          notFound();
        }
        throw new Error('Failed to fetch product');
      }

      product = await response.json();
      pageTitle = `Edit Product`;
    } catch (error) {
      console.error('Error fetching product:', error);
      notFound();
    }
  }

  return <ProductForm pageTitle={pageTitle} />;
}
