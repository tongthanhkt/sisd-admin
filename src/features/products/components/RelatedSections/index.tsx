'use client';

import { SortableSpecItem } from '@/components';
import NoData from '@/components/NoData';
import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';
import { useSortableList } from '@/hooks/use-sortable-list';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { GripVerticalIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { RelatedProductModal } from '../RelatedProductModal';

export interface RelatedItem {
  id: string;
  name: string;
  image: string;
  category: string;
}

export interface RelatedSectionsProps {
  items: RelatedItem[];
  value: string[];
  onChange: (ids: string[]) => void;
  label: string;
  addButtonText: string;
  itemLabel: (item: RelatedItem) => string;
  itemImage: (item: RelatedItem) => string;
  itemCategory?: (item: RelatedItem) => string;
  maxSelected?: number;
  modalComponent?: React.ComponentType<any>;
}

export function RelatedSections({
  items,
  value,
  onChange,
  label,
  addButtonText,
  itemLabel,
  itemImage,
  itemCategory,
  maxSelected = 3,
  modalComponent: ModalComponent = RelatedProductModal
}: RelatedSectionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(value);
  const { sensors, handleDragEnd } = useSortableList({
    items: selectedIds.map((id) => ({ id })),
    onItemsChange: (newArr) => {
      const newIds = newArr.map((item) => item.id);
      setSelectedIds(newIds);
      onChange(newIds);
    }
  });

  useEffect(() => {
    setSelectedIds(value);
  }, [value]);

  const handleAdd = (ids: string[]) => {
    setSelectedIds(ids);
    onChange(ids);
  };

  const handleRemove = (id: string) => {
    const newIds = selectedIds.filter((itemId) => itemId !== id);
    setSelectedIds(newIds);
    onChange(newIds);
  };

  const selectedObjects: RelatedItem[] = selectedIds
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is RelatedItem => Boolean(item));

  return (
    <div className='flex flex-col gap-4'>
      <FormLabel>{label}</FormLabel>
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
      />
    </div>
  );
}
