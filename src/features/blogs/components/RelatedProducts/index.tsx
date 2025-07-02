'use client';

import {
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_DEFAULT_PER_PAGE
} from '@/constants/pagination';
import { PRODUCT_LABELS } from '@/constants/products';
import { useGetProductsQuery } from '@/lib/api/products';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import { BlogFormValues } from '../../utils/form-schema';
import { RelatedSections } from '../RelatedSections';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

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

  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(PAGINATION_DEFAULT_PAGE);
  const [itemsPerPage] = useState(PAGINATION_DEFAULT_PER_PAGE);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [inputValue, setInputValue] = useState(
    searchParams.get('search') || ''
  );
  const debouncedInput = useDebounce(inputValue, 500);

  // Sync search state with query params
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setInputValue(searchParams.get('search') || '');
  }, [searchParams]);

  // Debounce search input and update query params
  useEffect(() => {
    setSearch(debouncedInput);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (debouncedInput) params.set('search', debouncedInput);
    else params.delete('search');
    router.replace(`?${params.toString()}`);
  }, [debouncedInput]);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
  };

  const { data: productData } = useGetProductsQuery({
    page: currentPage,
    perPage: itemsPerPage,
    search,
    category: ''
  });
  const products = productData?.products || [];
  const totalItems = productData?.total_products || 0;

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
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={totalItems}
      onPageChange={setCurrentPage}
      search={inputValue}
      onSearchChange={handleSearchChange}
    />
  );
}
