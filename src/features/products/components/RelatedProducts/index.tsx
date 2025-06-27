'use client';

import { SortableSpecItem } from '@/components';
import NoData from '@/components/NoData';
import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';
import { PRODUCT_LABELS } from '@/constants/products';
import { useSortableList } from '@/hooks/use-sortable-list';
import { IMortalProduct } from '@/models/MortalProduct';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { GripVerticalIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { RelatedProductModal } from '../RelatedProductModal';

interface RelatedProduct {
  id: string;
}

export function RelatedProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleAddProducts = (selectedProductIds: string[]) => {
    setRelatedProducts(selectedProductIds.map((id) => ({ id })));
  };

  const handleRemoveProduct = (productId: string) => {
    setRelatedProducts((prev) =>
      prev.filter((product) => product.id !== productId)
    );
  };

  const { sensors, handleDragEnd } = useSortableList({
    items: relatedProducts,
    onItemsChange: setRelatedProducts
  });

  // Khi render relatedProducts, map id sang product object từ allProducts
  const relatedProductObjects: IMortalProduct[] = relatedProducts
    .map((rp) => allProducts.find((p) => p.id === rp.id))
    .filter((p): p is IMortalProduct => Boolean(p));

  return (
    <div className='flex flex-col gap-4'>
      <FormLabel>Related Products</FormLabel>

      <div className='flex flex-col gap-4'>
        {relatedProductObjects.length === 0 ? (
          <NoData />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={relatedProductObjects.map((product) => product.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className='flex flex-col gap-4'>
                {relatedProductObjects.map((product) => (
                  <SortableSpecItem key={product.id} id={product.id}>
                    {(listeners) => (
                      <div className='flex items-center justify-between rounded-lg border p-4'>
                        <div className='flex items-center space-x-4'>
                          <div className='relative h-16 w-16 overflow-hidden rounded-md'>
                            <Image
                              src={product.image || ''}
                              alt={product.name || ''}
                              fill
                              className='object-cover'
                              sizes='64px'
                            />
                          </div>
                          <div>
                            <h4 className='font-medium text-gray-900'>
                              {product.name || ''}
                            </h4>
                            <p className='text-sm text-gray-600'>
                              Category:{' '}
                              {product.category &&
                              PRODUCT_LABELS[product.category]
                                ? PRODUCT_LABELS[product.category]
                                : 'Unknown'}
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => handleRemoveProduct(product.id)}
                            className='h-8 w-8'
                          >
                            <Trash2Icon className='size-5 text-red-600' />
                          </Button>
                          <Button
                            type='button'
                            variant='ghost'
                            {...listeners}
                            className='h-8 w-8'
                          >
                            <GripVerticalIcon className='size-5' />
                          </Button>
                        </div>
                      </div>
                    )}
                  </SortableSpecItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
        <Button
          onClick={() => setIsModalOpen(true)}
          variant='outline'
          size='sm'
          className='ml-auto w-fit'
        >
          <PlusIcon className='size-4' />
          Add product
        </Button>
      </div>

      <RelatedProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAddProducts}
      />
    </div>
  );
}
