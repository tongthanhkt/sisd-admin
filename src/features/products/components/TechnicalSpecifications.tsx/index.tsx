// External libraries
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { GripVerticalIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useMemo } from 'react';
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
import { ProductFormValues } from '../../hooks/useProduct';

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

  // Helper to ensure every spec has a unique id - only generate new IDs when needed
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

  // Memoize the specifications to prevent unnecessary re-renders
  const currentSpecs = useMemo(() => {
    const specs =
      (values.technicalSpecifications?.specifications as SpecWithId[]) || [];
    return ensureSpecIds(specs);
  }, [values.technicalSpecifications?.specifications]);

  const { sensors, handleDragEnd, addItem, updateItem, removeItem } =
    useSortableList<SpecWithId>({
      items: currentSpecs,
      onItemsChange: (newSpecs) => {
        setValue('technicalSpecifications', {
          ...values.technicalSpecifications,
          specifications: newSpecs.map((spec) => ({
            id: spec.id, // Preserve the ID
            category: spec.category || '',
            performance: spec.performance || ''
          }))
        });
      }
    });

  return (
    <FormField
      control={control}
      name='technicalSpecifications.specifications'
      render={({ fieldState: { error } }) => {
        const specs = currentSpecs;

        return (
          <FormItem>
            <FormLabel>
              Technical Specifications{' '}
              <span className='text-destructive'>*</span>
            </FormLabel>
            <FormControl>
              <div className='space-y-4'>
                <FormField
                  control={control}
                  name='technicalSpecifications.standard'
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      placeholder='Standard'
                      {...field}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
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
                                <FormField
                                  control={control}
                                  name={`technicalSpecifications.specifications.${index}.category`}
                                  render={({
                                    field,
                                    fieldState: { error }
                                  }) => (
                                    <Input
                                      placeholder='Category'
                                      {...field}
                                      error={!!error}
                                    />
                                  )}
                                />
                                <div className='flex gap-2'>
                                  <FormField
                                    control={control}
                                    name={`technicalSpecifications.specifications.${index}.performance`}
                                    render={({
                                      field,
                                      fieldState: { error }
                                    }) => (
                                      <Input
                                        placeholder='Performance'
                                        {...field}
                                        error={!!error}
                                      />
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
                              </div>
                            )}
                          </SortableSpecItem>
                        ))
                      )}
                    </SortableContext>
                  </DndContext>
                  {error && (
                    <FormMessage className='text-destructive'>
                      {error.message}
                    </FormMessage>
                  )}
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
          </FormItem>
        );
      }}
    />
  );
};
