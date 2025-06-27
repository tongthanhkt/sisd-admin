'use client';

import {
  RelatedSectionModal,
  RelatedSectionModalProps
} from '../RelatedSectionModal';

interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
}

export function RelatedProductModal(
  props: Omit<
    RelatedSectionModalProps<Product>,
    'itemLabel' | 'itemImage' | 'itemCategory'
  >
) {
  return (
    <RelatedSectionModal<Product>
      {...props}
      itemLabel={(item) => item.name}
      itemImage={(item) => item.image}
      itemCategory={(item) => item.category}
    />
  );
}
