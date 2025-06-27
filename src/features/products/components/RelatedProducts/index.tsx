'use client';

import { SortableSpecItem } from '@/components';
import NoData from '@/components/NoData';
import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';
import { PRODUCT_CATEGORIES, PRODUCT_LABELS } from '@/constants/products';
import { useSortableList } from '@/hooks/use-sortable-list';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { GripVerticalIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { RelatedProductModal } from '../RelatedProductModal';

interface RelatedProduct {
  id: string;
  name: string;
  image: string;
  category: string;
}

export function RelatedProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);

  const handleAddProducts = (selectedProductIds: string[]) => {
    // Mock data for selected products
    const mockProducts: RelatedProduct[] = [
      {
        id: '1',
        name: 'Vữa thô DPC-100',
        image: '/product-1.png',
        category: PRODUCT_CATEGORIES.MORTAL
      },
      {
        id: '3',
        name: 'Vữa mịn DPX-200',
        image: '/product-3.png',
        category: PRODUCT_CATEGORIES.MORTAL
      }
    ];

    const newProducts = mockProducts.filter(
      (product) =>
        selectedProductIds.includes(product.id) &&
        !relatedProducts.find((rp) => rp.id === product.id)
    );

    setRelatedProducts((prev) => [...prev, ...newProducts]);
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

  return (
    <div className='flex flex-col gap-4'>
      <FormLabel>Related Products</FormLabel>

      <div className='flex flex-col gap-4'>
        {relatedProducts.length === 0 ? (
          <NoData />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={relatedProducts.map((product) => product.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className='flex flex-col gap-4'>
                {relatedProducts.map((product) => (
                  <SortableSpecItem key={product.id} id={product.id}>
                    {(listeners) => (
                      <div className='flex items-center justify-between rounded-lg border p-4'>
                        <div className='flex items-center space-x-4'>
                          <div className='relative h-16 w-16 overflow-hidden rounded-md'>
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className='object-cover'
                              sizes='64px'
                            />
                          </div>
                          <div>
                            <h4 className='font-medium text-gray-900'>
                              {product.name}
                            </h4>
                            <p className='text-sm text-gray-600'>
                              Category: {PRODUCT_LABELS[product.category]}
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
