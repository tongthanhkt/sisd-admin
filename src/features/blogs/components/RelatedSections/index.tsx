'use client';

import { SortableSpecItem } from '@/components';
import NoData from '@/components/NoData';
import { Button } from '@/components/ui/button';
import { FormLabel, FormMessage } from '@/components/ui/form';
import { useSortableList } from '@/hooks/use-sortable-list';
import { cn } from '@/lib/utils';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { GripVerticalIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { BlogFormValues } from '../../utils/form-schema';
import { RelatedProductModal } from '../RelatedProductModal';
import { useFormContext } from 'react-hook-form';

export interface RelatedItem {
  id: string;
  name: string;
  image: string;
  category: string;
}

export interface RelatedSectionsProps<T extends { id: string }> {
  items: T[];
  value: string[];
  onChange: (ids: string[]) => void;
  label: string;
  addButtonText: string;
  itemLabel: (item: T) => string;
  itemImage: (item: T) => string;
  itemCategory?: (item: T) => string;
  maxSelected?: number;
  modalComponent?: React.ComponentType<any>;
  renderTableColumns?: () => React.ReactNode;
  renderTableRow?: (
    item: T,
    selected: boolean,
    onToggle: () => void,
    disabled: boolean
  ) => React.ReactNode;
  helperText?: string;
  fieldName: keyof BlogFormValues;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export function RelatedSections<T extends { id: string }>({
  items,
  value,
  onChange,
  label,
  addButtonText,
  itemLabel,
  itemImage,
  itemCategory,
  maxSelected = 3,
  modalComponent: ModalComponent = RelatedProductModal,
  renderTableColumns,
  renderTableRow,
  helperText,
  fieldName,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  search,
  onSearchChange
}: RelatedSectionsProps<T>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(value);
  const { trigger } = useFormContext();
  const { sensors, handleDragEnd } = useSortableList({
    items: selectedIds?.map((id) => ({ id })),
    onItemsChange: (newArr) => {
      const newIds = newArr.map((item) => item.id);
      setSelectedIds(newIds);
      onChange(newIds);
      trigger(fieldName);
    }
  });

  useEffect(() => {
    setSelectedIds(value || []);
  }, [value]);

  const handleAdd = (ids: string[]) => {
    setSelectedIds(ids || []);
    onChange(ids);
    trigger(fieldName);
  };

  const handleRemove = (id: string) => {
    const newIds = selectedIds.filter((itemId) => itemId !== id);
    setSelectedIds(newIds);
    onChange(newIds);
    trigger(fieldName);
  };

  const selectedObjects: T[] = selectedIds
    .map((id) => items.find((item): item is T => item.id === id))
    .filter((item): item is T => Boolean(item));

  return (
    <div className='flex flex-col gap-4'>
      <FormLabel className={cn(helperText && 'text-destructive')}>
        {label} <span className='text-destructive'>*</span>
      </FormLabel>
      <div className='flex flex-col gap-4'>
        {selectedObjects.length === 0 ? (
          <NoData />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={selectedObjects.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className='flex flex-col gap-4'>
                {selectedObjects.map((item) => (
                  <SortableSpecItem key={item.id} id={item.id}>
                    {(listeners) => (
                      <div className='flex items-center justify-between rounded-lg border p-4'>
                        <div className='flex items-center space-x-4'>
                          <div className='relative h-16 w-16 overflow-hidden rounded-md'>
                            <Image
                              src={itemImage(item) || ''}
                              alt={itemLabel(item) || ''}
                              fill
                              className='object-cover'
                              sizes='64px'
                            />
                          </div>
                          <div>
                            <h4 className='font-medium text-gray-900'>
                              {itemLabel(item) || ''}
                            </h4>
                            {itemCategory && (
                              <p className='text-sm text-gray-600'>
                                Category: {itemCategory(item) || 'Unknown'}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => handleRemove(item.id)}
                            className='h-8 w-8'
                            type='button'
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
        {helperText && (
          <FormMessage className='text-destructive'>{helperText}</FormMessage>
        )}
        <Button
          onClick={() => setIsModalOpen(true)}
          variant='outline'
          size='sm'
          className='ml-auto w-fit'
          type='button'
        >
          <PlusIcon className='size-4' />
          {addButtonText}
        </Button>
      </div>

      <ModalComponent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAdd}
        selectedProductIds={selectedIds}
        maxSelected={maxSelected}
        allItems={items}
        itemLabel={itemLabel}
        itemImage={itemImage}
        itemCategory={itemCategory}
        renderTableColumns={renderTableColumns}
        renderTableRow={renderTableRow}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={onPageChange}
        search={search}
        onSearchChange={onSearchChange}
      />
    </div>
  );
}
