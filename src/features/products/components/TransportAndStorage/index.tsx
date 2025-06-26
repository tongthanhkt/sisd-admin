import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { ProductFormValues } from '../product-form';
import {
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GripVerticalIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { SortableSpecItem } from '@/components';
import { useSortableList } from '@/hooks/use-sortable-list';

// Define a type for transport rule item with id
interface TransportRuleItem {
  id: string;
  value: string;
}

// Helper to ensure every rule has a unique id
function ensureRuleIds(arr: any[]): TransportRuleItem[] {
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

const getRuleArray = (fieldValue: any): TransportRuleItem[] => {
  if (!fieldValue) return [];
  if (Array.isArray(fieldValue) && typeof fieldValue[0] === 'string') {
    return ensureRuleIds(fieldValue);
  }
  return fieldValue as TransportRuleItem[];
};

// Individual input component to prevent re-renders
const RuleInput = React.memo(
  ({
    item,
    index,
    onUpdate,
    onRemove,
    listeners
  }: {
    item: TransportRuleItem;
    index: number;
    onUpdate: (index: number, updates: Partial<TransportRuleItem>) => void;
    onRemove: (index: number) => void;
    listeners: any;
  }) => {
    const [localValue, setLocalValue] = useState(item.value);

    // Update local value when item changes
    useEffect(() => {
      setLocalValue(item.value);
    }, [item.value]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        onUpdate(index, { value: newValue });
      },
      [index, onUpdate]
    );

    const handleRemove = useCallback(() => {
      onRemove(index);
    }, [index, onRemove]);

    return (
      <div className='flex gap-2'>
        <Input
          placeholder={`Rule ${index + 1}`}
          value={localValue}
          onChange={handleChange}
        />
        <Button type='button' variant='ghost' onClick={handleRemove}>
          <Trash2Icon className='size-5 text-red-500' />
        </Button>
        <Button type='button' variant='ghost' {...listeners}>
          <GripVerticalIcon className='size-5' />
        </Button>
      </div>
    );
  }
);

RuleInput.displayName = 'RuleInput';

// Inner component to handle DnD
const TransportAndStorageDnd = React.memo(({ field }: { field: any }) => {
  const rulesArr = useMemo(() => getRuleArray(field.value), [field.value]);

  const onItemsChange = useCallback(
    (newItems: TransportRuleItem[]) => {
      // Convert back to string array for form submission
      const stringArray = newItems.map((item) => item.value);
      field.onChange(stringArray);
    },
    [field]
  );

  const { sensors, handleDragEnd, addItem, updateItem, removeItem } =
    useSortableList<TransportRuleItem>({
      items: rulesArr,
      onItemsChange
    });

  const handleAddItem = useCallback(() => {
    addItem({ value: '' });
  }, [addItem]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={rulesArr.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className='flex flex-col gap-4'>
          {rulesArr.map((item, index) => (
            <SortableSpecItem key={item.id} id={item.id}>
              {(listeners) => (
                <RuleInput
                  item={item}
                  index={index}
                  onUpdate={updateItem}
                  onRemove={removeItem}
                  listeners={listeners}
                />
              )}
            </SortableSpecItem>
          ))}
          <Button
            type='button'
            variant='outline'
            className='ml-auto w-fit'
            onClick={handleAddItem}
          >
            <PlusIcon className='size-5' /> Add Rule
          </Button>
        </div>
      </SortableContext>
    </DndContext>
  );
});

TransportAndStorageDnd.displayName = 'TransportAndStorageDnd';

export const TransportAndStorage = () => {
  const methods = useFormContext<ProductFormValues>();
  const { control } = methods;

  return (
    <FormField
      control={control}
      name='transportationAndStorage'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Transportation and Storage</FormLabel>
          <FormControl>
            <TransportAndStorageDnd field={field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
