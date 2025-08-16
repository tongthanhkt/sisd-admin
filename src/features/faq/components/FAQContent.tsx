import { SortableSpecItem } from '@/components';
import NoData from '@/components/NoData';
import { Button } from '@/components/ui/button';
import { FormField, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { GripVerticalIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { FieldArrayPath, useFieldArray, useFormContext } from 'react-hook-form';

export const FAQContent = ({ name }: { name: FieldArrayPath<any> }) => {
  const { control, setValue, watch } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name
  });

  // DnD handlers
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
    <div className='flex flex-col gap-2'>
      <FormLabel>Contents</FormLabel>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
                  <div className='flex w-full gap-2'>
                    <FormField
                      control={control}
                      name={`${name}.${index}`}
                      render={({ field, fieldState: { error } }) => (
                        <Textarea
                          placeholder='Content'
                          {...field}
                          error={!!error}
                          wrapperClassName='w-full'
                        />
                      )}
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      onClick={() => {
                        remove(index);
                      }}
                      className='w-fit'
                    >
                      <Trash2Icon className='size-5 text-red-500' />
                    </Button>
                    <Button type='button' variant='ghost' {...listeners}>
                      <GripVerticalIcon className='size-5' />
                    </Button>
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
        onClick={() => append({ content: '' })}
        className='ml-auto w-fit'
      >
        <PlusIcon className='size-4' /> Add content
      </Button>
    </div>
  );
};
