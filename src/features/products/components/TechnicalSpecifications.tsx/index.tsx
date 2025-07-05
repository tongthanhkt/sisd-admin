// External libraries
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { GripVerticalIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useMemo } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

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
  const { control } = methods;

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'technicalSpecifications.specifications'
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id);
      const newIndex = fields.findIndex((item) => item.id === over?.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        move(oldIndex, newIndex);
      }
    }
  };

  return (
    <FormField
      control={control}
      name='technicalSpecifications.specifications'
      render={({ fieldState: { error } }) => (
        <FormItem>
          <FormLabel>
            Technical Specifications <span className='text-destructive'>*</span>
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
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={fields.map((spec) => spec.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {fields.length === 0 ? (
                      <NoData />
                    ) : (
                      fields.map((spec, index) => (
                        <SortableSpecItem key={spec.id} id={spec.id}>
                          {(listeners) => (
                            <div className='grid grid-cols-2 gap-4'>
                              <FormField
                                control={control}
                                name={`technicalSpecifications.specifications.${index}.category`}
                                render={({ field, fieldState: { error } }) => (
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
                                    remove(index);
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
                    append({
                      id:
                        typeof crypto !== 'undefined' && crypto.randomUUID
                          ? crypto.randomUUID()
                          : `${Date.now()}-${Math.random()}`,
                      category: '',
                      performance: ''
                    });
                  }}
                  className='ml-auto w-fit'
                >
                  <PlusIcon className='size-4' /> Add Specification
                </Button>
              </div>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
