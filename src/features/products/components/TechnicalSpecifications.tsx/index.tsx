// External libraries
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { GripVerticalIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

// Aliased/internal imports
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
import { ProductFormValues } from '../product-form';

// Add a type for specification with id
interface SpecWithId {
  id: string;
  stt?: number;
  category?: string;
  performance?: string;
}

export const TechnicalSpecifications = () => {
  const methods = useFormContext<ProductFormValues>();
  const { control, watch, setValue } = methods;
  const values = watch();

  // Helper to ensure every spec has a unique id
  function ensureSpecIds(specs: SpecWithId[]) {
    return (specs || []).map((spec) => ({
      ...spec,
      id:
        spec.id ||
        (typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`)
    }));
  }

  // Get current specifications array
  const currentSpecs = ensureSpecIds(
    (values.technicalSpecifications?.specifications as SpecWithId[]) || []
  );

  const { sensors, handleDragEnd, addItem, updateItem, removeItem } =
    useSortableList<SpecWithId>({
      items: currentSpecs,
      onItemsChange: (newSpecs) => {
        setValue('technicalSpecifications', {
          ...values.technicalSpecifications,
          specifications: newSpecs
        });
      }
    });

  return (
    <FormField
      control={control}
      name='technicalSpecifications'
      render={({ field }) => {
        const specs = ensureSpecIds(
          (field.value?.specifications as SpecWithId[]) || []
        );

        return (
          <FormItem>
            <FormLabel>Technical Specifications</FormLabel>
            <FormControl>
              <div className='space-y-4'>
                <Input
                  placeholder='Standard'
                  value={field.value.standard}
                  onChange={(e) => {
                    field.onChange({
                      ...field.value,
                      standard: e.target.value
                    });
                  }}
                />
                <div className='flex flex-col gap-4'>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={specs.map((spec) => spec.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {specs.length === 0 ? (
                        <NoData />
                      ) : (
                        specs.map((spec, index) => (
                          <SortableSpecItem key={spec.id} id={spec.id}>
                            {(listeners) => (
                              <div className='grid grid-cols-2 gap-4'>
                                <Input
                                  placeholder='Category'
                                  value={spec.category}
                                  onChange={(e) => {
                                    updateItem(index, {
                                      category: e.target.value
                                    });
                                  }}
                                />
                                <div className='flex gap-2'>
                                  <Input
                                    placeholder='Performance'
                                    value={spec.performance}
                                    onChange={(e) => {
                                      updateItem(index, {
                                        performance: e.target.value
                                      });
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
                              </div>
                            )}
                          </SortableSpecItem>
                        ))
                      )}
                    </SortableContext>
                  </DndContext>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => {
                      addItem({
                        stt: specs.length + 1,
                        category: '',
                        performance: ''
                      });
                    }}
                    className='ml-auto w-fit'
                  >
                    <PlusIcon className='size-5' /> Add Specification
                  </Button>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
