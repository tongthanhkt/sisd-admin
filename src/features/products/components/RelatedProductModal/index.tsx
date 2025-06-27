'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { PRODUCT_CATEGORIES, PRODUCT_LABELS } from '@/constants/products';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
}

interface RelatedProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedProducts: string[]) => void;
}

export function RelatedProductModal({
  isOpen,
  onClose,
  onConfirm
}: RelatedProductModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const queryParams = new URLSearchParams();
      queryParams.set('page', String(currentPage));
      queryParams.set('perPage', String(itemsPerPage));
      if (searchTerm) queryParams.set('search', searchTerm);
      if (selectedCategory !== 'all')
        queryParams.set('category', selectedCategory);
      // Có thể thêm filter status/minPrice/maxPrice nếu API hỗ trợ
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products?${queryParams}`,
        { cache: 'no-store' }
      );
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
        setTotalProducts(data.total_products);
      }
      setLoading(false);
    }
    fetchProducts();
  }, [searchTerm, selectedCategory, currentPage, itemsPerPage]);

  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category === PRODUCT_CATEGORIES.MORTAL;

    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleProductToggle = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(paginatedProducts.map((p) => p.id));
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedProducts);
    onClose();
  };

  return (
    <Modal
      title='Select Related Products'
      description='Add products to the related products list'
      isOpen={isOpen}
      onClose={onClose}
      className='max-h-[calc(100vh-100px)] w-full !max-w-4xl'
    >
      <div className='space-y-6'>
        {/* Search Bar */}
        <div className='flex gap-4'>
          <div className='relative flex-1'>
            <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
            <Input
              placeholder='Type product name...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>
          <Button variant='outline' size='sm'>
            <Search className='mr-2 h-4 w-4' />
            Search
          </Button>
        </div>

        {/* Results Header */}
        <div className='flex items-center justify-between'>
          <div className='ml-auto flex items-center gap-2'>
            <Checkbox
              checked={
                selectedProducts.length === paginatedProducts.length &&
                paginatedProducts.length > 0
              }
              onCheckedChange={handleSelectAll}
            />
            <span className='text-sm text-gray-600'>Select all</span>
          </div>
        </div>

        {/* Products Table */}
        <div className='overflow-x-auto rounded-lg border'>
          <table className='w-full'>
            <thead
              className='sticky top-0 z-10 bg-gray-50'
              style={{ display: 'block' }}
            >
              <tr>
                <th className='sticky top-0 z-10 w-20 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700'>
                  Select
                </th>
                <th className='sticky top-0 z-10 w-28 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700'>
                  Image
                </th>
                <th className='sticky top-0 z-10 w-48 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700'>
                  Category
                </th>
                <th className='sticky top-0 z-10 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700'>
                  Product Name
                </th>
              </tr>
            </thead>
            <tbody
              className='block max-h-[calc(100vh-500px)] min-h-[calc(100vh-500px)] divide-y divide-gray-200 overflow-y-auto'
              style={{ display: 'block' }}
            >
              {paginatedProducts.filter(Boolean).map((product) => (
                <tr key={product.id} className='flex w-full hover:bg-gray-50'>
                  <td className='flex w-20 items-center justify-center px-4 py-3'>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => handleProductToggle(product.id)}
                    />
                  </td>
                  <td className='w-28 px-4 py-3'>
                    <div className='relative h-12 w-12 overflow-hidden rounded bg-gray-100'>
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className='object-cover'
                      />
                    </div>
                  </td>
                  <td className='w-48 px-4 py-3'>
                    <div className='text-gray-800'>
                      {PRODUCT_LABELS[product.category]}
                    </div>
                  </td>
                  <td className='flex-1 px-4 py-3'>
                    <div className='font-medium text-gray-900'>
                      {product.name}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalProducts > itemsPerPage && (
          <div className='flex items-center justify-between'>
            <div className='text-sm text-gray-600'>
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, totalProducts)} of{' '}
              {totalProducts} products
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from(
                { length: Math.ceil(totalProducts / itemsPerPage) },
                (_, i) => i + 1
              ).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setCurrentPage(page)}
                  className='h-8 w-8 p-0'
                >
                  {page}
                </Button>
              ))}
              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, Math.ceil(totalProducts / itemsPerPage))
                  )
                }
                disabled={
                  currentPage === Math.ceil(totalProducts / itemsPerPage)
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className='flex items-center justify-between border-t pt-4'>
          <div className='text-sm text-gray-600'>
            Selected: {selectedProducts.length} products
          </div>
          <div className='flex gap-3'>
            <Button variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedProducts.length === 0}
            >
              Add selected products ({selectedProducts.length})
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
