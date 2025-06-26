import { SortableSpecItem } from '@/components';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSortableList } from '@/hooks/use-sortable-list';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { GripVerticalIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FieldName, ProductFormValues } from '../product-form';

// Define a type for list item with id
interface ListItem {
  id: string;
  value: string;
}

interface SortableListFieldProps {
  fieldName: FieldName;
  title: string;
  addButtonText?: string;
  placeholder?: string;
}

export const SortableListField = ({
  fieldName,
  title,
  addButtonText = 'Add Item',
  placeholder = 'Enter item'
}: SortableListFieldProps) => {
  const methods = useFormContext<ProductFormValues>();
  const { control, watch, setValue } = methods;
  const values = watch();

  // Helper to ensure every item has a unique id
  function ensureItemIds(arr: any[]): ListItem[] {
    return (arr || []).map((item) =>
      typeof item === 'string'
        ? {
            id:
              typeof crypto !== 'undefined' && crypto.randomUUID
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random()}`,
            value: item
          }
        : {
            ...item,
            id:
              item.id ||
              (typeof crypto !== 'undefined' && crypto.randomUUID
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random()}`)
          }
    );
  }

  const getItemArray = (fieldValue: any): ListItem[] => {
    if (!fieldValue) return [];
    if (Array.isArray(fieldValue) && typeof fieldValue[0] === 'string') {
      return ensureItemIds(fieldValue);
    }
    return fieldValue as ListItem[];
  };

  // Get current items array
  const currentItems = getItemArray(values[fieldName]);

  const { sensors, handleDragEnd, addItem, updateItem, removeItem } =
    useSortableList<ListItem>({
      items: currentItems,
      onItemsChange: (newItems) => setValue(fieldName, newItems)
    });

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => {
        const itemsArr = getItemArray(field.value);

        return (
          <FormItem>
            <FormLabel>{title}</FormLabel>
            <FormControl>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={itemsArr.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className='flex flex-col gap-4'>
                    {itemsArr.map((item, index) => (
                      <SortableSpecItem key={item.id} id={item.id}>
                        {(listeners) => (
                          <div className='flex gap-2'>
                            <Input
                              placeholder={`${placeholder} ${index + 1}`}
                              value={item.value}
                              onChange={(e) => {
                                updateItem(index, { value: e.target.value });
                              }}
                            />
                            <Button
                              type='button'
                              variant='ghost'
                              onClick={() => {
                                removeItem(index);
                              }}
                            >
                              <Trash2Icon className='size-5 text-red-500' />
                            </Button>
                            <Button
                              type='button'
                              variant='ghost'
                              {...listeners}
                            >
                              <GripVerticalIcon className='size-5' />
                            </Button>
                          </div>
                        )}
                      </SortableSpecItem>
                    ))}
                    <Button
                      type='button'
                      variant='outline'
                      className='ml-auto w-fit'
                      onClick={() => {
                        addItem({ value: '' });
                      }}
                    >
                      <PlusIcon className='size-5' /> {addButtonText}
                    </Button>
                  </div>
                </SortableContext>
              </DndContext>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
