'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import Image from 'next/image';
import { useState } from 'react';

export interface RelatedSectionModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedIds: string[]) => void;
  selectedIds?: string[];
  maxSelected?: number;
  allItems: T[];
  itemLabel: (item: T) => string;
  itemImage: (item: T) => string;
  itemCategory?: (item: T) => string;
  renderTableColumns?: () => React.ReactNode;
  renderTableRow?: (
    item: T,
    selected: boolean,
    onToggle: () => void,
    disabled: boolean
  ) => React.ReactNode;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export function RelatedSectionModal<T>({
  isOpen,
  onClose,
  onConfirm,
  selectedIds = [],
  maxSelected = 3,
  allItems,
  itemLabel,
  itemImage,
  itemCategory,
  renderTableColumns,
  renderTableRow,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  search,
  onSearchChange
}: RelatedSectionModalProps<T>) {
  console.log(
    '🚀 ~  currentPage, itemsPerPage, totalItems:',
    currentPage,
    itemsPerPage,
    totalItems
  );
  const [selected, setSelected] = useState<string[]>(selectedIds);

  // Filter items by search (parent should paginate, not here)
  const filteredItems = allItems.filter((item) => {
    const label = itemLabel(item).toLowerCase();
    return label.includes(search.toLowerCase());
  });

  const remainingSelectable = maxSelected - (selectedIds?.length || 0);

  const handleToggle = (itemId: string) => {
    if (selected.includes(itemId)) {
      setSelected((prev) => prev.filter((id) => id !== itemId));
    } else {
      if (selected.length < remainingSelectable) {
        setSelected((prev) => [...prev, itemId]);
      } else {
        alert(`You can only select up to ${maxSelected} items in total.`);
      }
    }
  };

  const handleConfirm = () => {
    onConfirm(selected);
    onClose();
  };

  return (
    <Modal
      title='Select Items'
      description='Add items to the related list'
      isOpen={isOpen}
      onClose={onClose}
      className='max-h-[calc(100vh-100px)] w-full !max-w-4xl'
    >
      <div className='space-y-6'>
        {/* Search Bar */}
        <div className='flex gap-4'>
          <div className='relative flex-1'>
            <Input
              placeholder='Type item name...'
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className='pl-10'
            />
          </div>
          <Button variant='outline' size='sm'>
            Search
          </Button>
        </div>
        {/* Table */}
        <div className='overflow-x-auto rounded-lg border'>
          <table className='w-full'>
            <thead
              className='sticky top-0 z-10 bg-gray-50'
              style={{ display: 'block' }}
            >
              <tr>
                {renderTableColumns ? (
                  renderTableColumns()
                ) : (
                  <>
                    <th className='sticky top-0 z-10 w-20 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700'>
                      Select
                    </th>
                    <th className='sticky top-0 z-10 w-28 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700'>
                      Image
                    </th>
                    {itemCategory && (
                      <th className='sticky top-0 z-10 w-48 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700'>
                        Category
                      </th>
                    )}
                    <th className='sticky top-0 z-10 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700'>
                      Name
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody
              className='block max-h-[calc(100vh-500px)] min-h-[calc(100vh-500px)] divide-y divide-gray-200 overflow-y-auto'
              style={{ display: 'block' }}
            >
              {filteredItems.map((item: any) =>
                renderTableRow ? (
                  renderTableRow(
                    item,
                    selected.includes(item.id),
                    () => handleToggle(item.id),
                    !selected.includes(item.id) &&
                      selected.length >= remainingSelectable
                  )
                ) : (
                  <tr key={item.id} className='flex w-full hover:bg-gray-50'>
                    <td className='flex w-20 items-center justify-center px-4 py-3'>
                      <Checkbox
                        checked={selected.includes(item.id)}
                        onCheckedChange={() => handleToggle(item.id)}
                        disabled={
                          !selected.includes(item.id) &&
                          selected.length >= remainingSelectable
                        }
                      />
                    </td>
                    <td className='w-28 px-4 py-3'>
                      <div className='relative h-12 w-12 overflow-hidden rounded bg-gray-100'>
                        <Image
                          src={itemImage(item)}
                          alt={itemLabel(item)}
                          fill
                          className='object-cover'
                        />
                      </div>
                    </td>
                    {itemCategory && (
                      <td className='w-48 px-4 py-3'>
                        <div className='text-gray-800'>
                          {itemCategory(item) || 'Unknown'}
                        </div>
                      </td>
                    )}
                    <td className='flex-1 px-4 py-3'>
                      <div className='font-medium text-gray-900'>
                        {itemLabel(item)}
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalItems > itemsPerPage && (
          <div className='flex items-center justify-between'>
            <div className='text-sm text-gray-600'>
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{' '}
              items
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from(
                { length: Math.ceil(totalItems / itemsPerPage) },
                (_, i) => i + 1
              ).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => onPageChange(page)}
                  className='h-8 w-8 p-0'
                >
                  {page}
                </Button>
              ))}
              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  onPageChange(
                    Math.min(
                      currentPage + 1,
                      Math.ceil(totalItems / itemsPerPage)
                    )
                  )
                }
                disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
        {/* Footer Actions */}
        <div className='flex items-center justify-between border-t pt-4'>
          <div className='text-sm text-gray-600'>
            Selected: {selected.length} items
          </div>
          <div className='flex gap-3'>
            <Button variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={selected.length === 0}>
              Add selected items ({selected.length})
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
