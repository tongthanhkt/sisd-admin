'use client';

import {
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_DEFAULT_PER_PAGE
} from '@/constants/pagination';
import { PRODUCT_LABELS } from '@/constants/products';
import { useGetProductsQuery } from '@/lib/api/products';
import { useSearchParams } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import { BlogFormValues } from '../../utils/form-schema';
import { RelatedSections } from '../RelatedSections';

export interface RelatedProduct {
  id: string;
}

export function RelatedProducts() {
  const methods = useFormContext<BlogFormValues>();
  const {
    watch,
    setValue,
    formState: { errors }
  } = methods;
  const relatedProducts = watch('relatedProducts');
  const searchParams = useSearchParams();
  const page = parseInt(
    searchParams.get('page') || PAGINATION_DEFAULT_PAGE.toString()
  );
  const pageLimit = parseInt(
    searchParams.get('perPage') || PAGINATION_DEFAULT_PER_PAGE.toString()
  );
  const search = searchParams.get('search') || '';

  const { data: productData } = useGetProductsQuery({
    page,
    perPage: pageLimit,
    search,
    category: ''
  });
  const products = productData?.products || [];

  const validProducts = products
    .filter((item) => typeof item._id === 'string' && item._id.length > 0)
    .map((item) => ({
      id: (item._id as string) || '',
      name: item.name || '',
      image: item.image || '',
      category: item.category || ''
    }));

  return (
    <RelatedSections
      items={validProducts}
      value={relatedProducts}
      onChange={(ids) =>
        setValue(
          'relatedProducts',
          ids?.map((id) => id)
        )
      }
      label='Related Products'
      addButtonText='Add product'
      itemLabel={(item) => item.name || ''}
      itemImage={(item) => item.image || ''}
      itemCategory={(item) =>
        item.category ? PRODUCT_LABELS[item.category] : ''
      }
      fieldName='relatedProducts'
      helperText={errors.relatedProducts?.message}
    />
  );
}
