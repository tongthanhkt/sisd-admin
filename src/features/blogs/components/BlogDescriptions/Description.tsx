import { SortableSpecItem } from '@/components';
import NoData from '@/components/NoData';
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
import { Path, useFormContext } from 'react-hook-form';
import { BlogFormValues } from '../../utils/form-schema';
import { Textarea } from '@/components/ui/textarea';

// Define a type for list item with id
interface ListItem {
  id: string;
  value: string;
}

interface SortableListFieldProps {
  fieldName: keyof BlogFormValues;
  title: string;
  addButtonText?: string;
  placeholder?: string;
}

export const Description = ({
  fieldName,
  title,
  addButtonText = 'Add Item',
  placeholder = 'Enter item'
}: SortableListFieldProps) => {
  const methods = useFormContext<BlogFormValues>();
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
      render={({ field, fieldState: { error } }) => {
        const itemsArr = getItemArray(field.value);

        return (
          <FormItem className='w-full'>
            <FormLabel>
              {title} <span className='text-destructive'>*</span>
            </FormLabel>
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
                  <div className='flex w-full flex-col gap-4'>
                    {itemsArr.length === 0 ? (
                      <NoData />
                    ) : (
                      itemsArr.map((item, index) => (
                        <SortableSpecItem key={item.id} id={item.id}>
                          {(listeners) => (
                            <div className='flex w-full flex-1'>
                              <FormField
                                control={control}
                                name={
                                  `${fieldName}.${index}.value` as Path<BlogFormValues>
                                }
                                render={({ field, fieldState: { error } }) => (
                                  <FormItem className='!w-full'>
                                    <FormControl>
                                      <Textarea
                                        {...field}
                                        placeholder={`${placeholder} ${index + 1}`}
                                        value={item.value}
                                        onChange={(e) => {
                                          updateItem(index, {
                                            value: e.target.value
                                          });
                                        }}
                                        error={!!error}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
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
                      ))
                    )}
                    {error && (
                      <FormMessage className='text-destructive'>
                        {error.message}
                      </FormMessage>
                    )}
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
          </FormItem>
        );
      }}
    />
  );
};
