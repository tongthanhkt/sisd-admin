'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconX } from '@tabler/icons-react';
import Image from 'next/image';
import { RelatedProductModal } from '../RelatedProductModal';

interface RelatedProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  status: 'active' | 'out_of_stock';
  image: string;
}

export function RelatedProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);

  const handleAddProducts = (selectedProductIds: string[]) => {
    // Mock data for selected products
    const mockProducts: RelatedProduct[] = [
      {
        id: '1',
        name: 'Sản phẩm E',
        sku: 'SPE05',
        price: 150000,
        status: 'active',
        image: '/product-1.png'
      },
      {
        id: '3',
        name: 'Sản phẩm G',
        sku: 'SPG07',
        price: 125000,
        status: 'out_of_stock',
        image: '/product-3.png'
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
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
                        SKU: {product.sku}
                      </p>
                      <p className='text-sm font-medium text-gray-900'>
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Badge
                      variant={
                        product.status === 'active' ? 'default' : 'secondary'
                      }
                      className={
                        product.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {product.status === 'active' ? 'Hoạt động' : 'Hết hàng'}
                    </Badge>
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
