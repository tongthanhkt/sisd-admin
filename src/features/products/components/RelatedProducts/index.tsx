'use client';

import { PRODUCT_LABELS } from '@/constants/products';
import { IMortalProduct } from '@/models/MortalProduct';
import { useEffect, useState } from 'react';
import { RelatedSections } from '../RelatedSections';

export interface RelatedProduct {
  id: string;
}

export function RelatedProducts() {
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [allProducts, setAllProducts] = useState<IMortalProduct[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const queryParams = new URLSearchParams();
      queryParams.set('page', '1');
      queryParams.set('perPage', '100');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products?${queryParams}`,
        { cache: 'no-store' }
      );
      if (response.ok) {
        const data = await response.json();
        setAllProducts(data.products);
      }
    }
    fetchProducts();
  }, []);

  const validProducts = allProducts
    .filter(
      (item): item is IMortalProduct =>
        typeof item.id === 'string' && item.id.length > 0
    )
    .map((item) => ({
      id: item.id,
      name: item.name || '',
      image: item.image || '',
      category: item.category || ''
    }));

  return (
    <RelatedSections
      items={validProducts}
      value={relatedProducts.map((p) => p.id)}
      onChange={(ids) => setRelatedProducts(ids.map((id) => ({ id })))}
      label='Related Products'
      addButtonText='Add product'
      itemLabel={(item) => item.name || ''}
      itemImage={(item) => item.image || ''}
      itemCategory={(item) =>
        item.category ? PRODUCT_LABELS[item.category] : ''
      }
    />
  );
}
