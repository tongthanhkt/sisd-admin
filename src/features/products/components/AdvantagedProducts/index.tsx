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
import { ProductFormValues } from '../product-form';

// Define a type for advantage item with id
interface AdvantageItem {
  id: string;
  value: string;
}

export const AdvantagedProducts = () => {
  const methods = useFormContext<ProductFormValues>();
  const { control, watch, setValue } = methods;
  const values = watch();

  // Helper to ensure every advantage has a unique id
  function ensureAdvantageIds(arr: any[]): AdvantageItem[] {
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

  // Ensure ids on mount
  React.useEffect(() => {
    const arr = values.advantages || [];
    if (arr.some((item: any) => typeof item === 'string' || !item.id)) {
      setValue('advantages', ensureAdvantageIds(arr));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAdvantageArray = (fieldValue: any): AdvantageItem[] => {
    if (!fieldValue) return [];
    if (Array.isArray(fieldValue) && typeof fieldValue[0] === 'string') {
      return ensureAdvantageIds(fieldValue);
    }
    return fieldValue as AdvantageItem[];
  };

  // Get current advantages array
  const currentAdvantages = getAdvantageArray(values.advantages);

  const { sensors, handleDragEnd, addItem, updateItem, removeItem } =
    useSortableList<AdvantageItem>({
      items: currentAdvantages,
      onItemsChange: (newItems) => setValue('advantages', newItems)
    });

  return (
    <FormField
      control={control}
      name='advantages'
      render={({ field }) => {
        const advArr = getAdvantageArray(field.value);

        return (
          <FormItem>
            <FormLabel>Advantages</FormLabel>
            <FormControl>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={advArr.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className='flex flex-col gap-4'>
                    {advArr.map((item, index) => (
                      <SortableSpecItem key={item.id} id={item.id}>
                        {(listeners) => (
                          <div className='flex gap-2'>
                            <Input
                              placeholder={`Advantage ${index + 1}`}
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
                      <PlusIcon className='size-5' /> Add Advantage
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
