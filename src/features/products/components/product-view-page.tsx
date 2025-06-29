import ProductForm from './product-form';

export default async function ProductViewPage({
  productId
}: {
  productId: string;
}) {
  let pageTitle = 'Create New Product';

  if (productId !== 'new') {
    pageTitle = `Edit Product`;
  }

  return <ProductForm pageTitle={pageTitle} productId={productId} />;
}
