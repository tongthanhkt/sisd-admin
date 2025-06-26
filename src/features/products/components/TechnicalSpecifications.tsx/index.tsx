// External libraries
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { GripVerticalIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

// Aliased/internal imports
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
  const sensors = useSensors(useSensor(PointerSensor));

  // Helper to ensure every spec has a unique id
  function ensureSpecIds(specs: any[]): SpecWithId[] {
    return (specs || []).map((spec) => ({
      ...spec,
      id:
        spec.id ||
        (typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`)
    }));
  }

  // Ensure ids on mount
  React.useEffect(() => {
    const specs = watch('technicalSpecifications.specifications') || [];
    if (specs.some((spec: any) => !spec.id)) {
      setValue('technicalSpecifications.specifications', ensureSpecIds(specs));
    }
  }, []);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      // Use the current array, do NOT call ensureSpecIds here
      const specs = (values.technicalSpecifications.specifications ||
        []) as SpecWithId[];
      const oldIndex = specs.findIndex((item) => item.id === active.id);
      const newIndex = specs.findIndex((item) => item.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newSpecs = arrayMove(specs, oldIndex, newIndex);
        setValue('technicalSpecifications.specifications', newSpecs);
      }
    }
  };

  return (
    <FormField
      control={control}
      name='technicalSpecifications'
      render={({ field }) => (
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
              <div className='flex flex-col gap-2'>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={(
                      (field.value?.specifications as SpecWithId[]) || []
                    ).map((spec) => spec.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {((field.value?.specifications as SpecWithId[]) || []).map(
                      (spec, index) => (
                        <SortableSpecItem key={spec.id} id={spec.id}>
                          {(listeners) => (
                            <div className='grid grid-cols-2 gap-2'>
                              <Input
                                placeholder='Category'
                                value={spec.category}
                                onChange={(e) => {
                                  const newSpecs = [
                                    ...(field.value?.specifications || [])
                                  ];
                                  newSpecs[index] = {
                                    ...spec,
                                    category: e.target.value
                                  };
                                  field.onChange({
                                    ...field.value,
                                    specifications: newSpecs
                                  });
                                }}
                              />
                              <div className='flex gap-2'>
                                <Input
                                  placeholder='Performance'
                                  value={spec.performance}
                                  onChange={(e) => {
                                    const newSpecs = [
                                      ...((field.value
                                        ?.specifications as SpecWithId[]) || [])
                                    ];
                                    newSpecs[index] = {
                                      ...spec,
                                      performance: e.target.value
                                    };
                                    field.onChange({
                                      ...field.value,
                                      specifications: newSpecs
                                    });
                                  }}
                                />
                                <Button
                                  type='button'
                                  variant='ghost'
                                  onClick={() => {
                                    const newSpecs = (
                                      (field.value
                                        ?.specifications as SpecWithId[]) || []
                                    ).filter((_, i) => i !== index);
                                    field.onChange({
                                      ...field.value,
                                      specifications: newSpecs
                                    });
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
                      )
                    )}
                  </SortableContext>
                </DndContext>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    field.onChange({
                      ...field.value,
                      specifications: [
                        ...ensureSpecIds(
                          (field.value?.specifications as SpecWithId[]) || []
                        ),
                        {
                          id:
                            typeof crypto !== 'undefined' && crypto.randomUUID
                              ? crypto.randomUUID()
                              : `${Date.now()}-${Math.random()}`,
                          stt:
                            (
                              (field.value?.specifications as SpecWithId[]) ||
                              []
                            ).length + 1,
                          category: '',
                          performance: ''
                        }
                      ]
                    });
                  }}
                  className='mt-2 ml-auto w-fit'
                >
                  <PlusIcon className='size-5' /> Add Specification
                </Button>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
