import { IMortalProduct } from '@/models/MortalProduct';
import { ProductTable } from './product-tables';
import { columns } from './product-tables/columns';

type ProductListingPageProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function ProductListingPage({
  searchParams
}: ProductListingPageProps) {
  const page = Number(searchParams?.page || '1');
  const pageLimit = Number(searchParams?.perPage || '10');
  const search = searchParams?.name as string;
  const categories = searchParams?.category as string;

  const queryParams = new URLSearchParams();
  queryParams.set('page', String(page));
  queryParams.set('perPage', String(pageLimit));
  if (search) queryParams.set('search', search);
  if (categories) queryParams.set('category', categories);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products?${queryParams}`,
    {
      cache: 'no-store'
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const data = await response.json();
  const totalProducts = data.total_products;
  const products: IMortalProduct[] = data.products;

  return (
    <ProductTable
      data={products}
      totalItems={totalProducts}
      columns={columns}
      page={page}
      perPage={pageLimit}
    />
  );
}
