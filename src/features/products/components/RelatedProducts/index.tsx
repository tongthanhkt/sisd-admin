'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PRODUCT_CATEGORIES, PRODUCT_LABELS } from '@/constants/products';
import { IconX } from '@tabler/icons-react';
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

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Sản phẩm liên quan</CardTitle>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant='outline'
              size='sm'
            >
              Thêm sản phẩm
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {relatedProducts.length === 0 ? (
            <div className='py-8 text-center text-gray-500'>
              <p>Chưa có sản phẩm liên quan nào</p>
              <p className='text-sm'>
                Nhấn &quot;Thêm sản phẩm&quot; để bắt đầu
              </p>
            </div>
          ) : (
            <div className='space-y-4'>
              {relatedProducts.map((product) => (
                <div
                  key={product.id}
                  className='flex items-center justify-between rounded-lg border p-4'
                >
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
                      <IconX className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <RelatedProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAddProducts}
      />
    </>
  );
}
