import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useSortableList } from '@/hooks/use-sortable-list';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

import { SortableSpecItem } from '@/components';
import NoData from '@/components/NoData';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GripVerticalIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FAQContent } from './FAQContent';

export const FAQItem = () => {
  const methods = useFormContext();
  const { control, watch, setValue } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'body'
  });
  const { sensors, handleDragEnd, removeItem } = useSortableList({
    items: fields.map((f, i) => ({ ...f, ...watch('body')[i] })),
    onItemsChange: (newItems) => {
      setValue('body', newItems);
    }
  });

  const body = (watch('body') || []).filter((s: any) => !!s && !!s.id);
  return (
    <FormField
      control={control}
      name='body'
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>
              Question <span className='text-destructive'>*</span>
            </FormLabel>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={body.map((section: any) => section.id as string)}
                strategy={verticalListSortingStrategy}
              >
                <Accordion type='multiple' className='mb-4'>
                  {body?.length > 0 ? (
                    body.map((section: any, index: number) => (
                      <SortableSpecItem
                        key={section.id as string}
                        id={section.id as string}
                      >
                        {(listeners) => (
                          <AccordionItem value={`item-${section.id as string}`}>
                            <div className='flex items-center gap-2 px-2 py-1'>
                              <AccordionTrigger className='flex min-w-0 flex-1 flex-row-reverse items-center px-0'>
                                <div className='w-full truncate text-left'>
                                  {section?.headline || `Question ${index + 1}`}
                                </div>
                              </AccordionTrigger>
                              <div className='flex flex-shrink-0 items-center'>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  type='button'
                                  tabIndex={-1}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeItem(index);
                                  }}
                                  className='ml-1 hover:bg-red-50'
                                >
                                  <Trash2Icon className='size-5 text-red-500' />
                                </Button>
                                <button
                                  type='button'
                                  {...listeners}
                                  tabIndex={-1}
                                  className='hover:bg-accent mr-1 cursor-grab rounded p-1'
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <GripVerticalIcon className='size-5' />
                                </button>
                              </div>
                            </div>
                            <AccordionContent>
                              <div className='space-y-4 rounded-lg border border-solid p-4'>
                                <FormField
                                  control={control}
                                  name={`body.${index}.question`}
                                  render={({ field }) => (
                                    <Input
                                      label='Question'
                                      placeholder='Enter question'
                                      {...field}
                                    />
                                  )}
                                />
                                <FAQContent name={`body.${index}.contents`} />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )}
                      </SortableSpecItem>
                    ))
                  ) : (
                    <NoData />
                  )}
                </Accordion>
              </SortableContext>
            </DndContext>
            <FormMessage />
            <Button
              onClick={() =>
                append({
                  id:
                    typeof crypto !== 'undefined' && crypto.randomUUID
                      ? crypto.randomUUID()
                      : `${Date.now()}-${Math.random()}`,
                  headline: '',
                  headline2: '',
                  contents: [],
                  images: [],
                  subHeadline: []
                })
              }
              type='button'
              variant='outline'
              className='ml-auto w-fit'
            >
              <PlusIcon className='size-4' /> Add question
            </Button>
          </FormItem>
        );
      }}
    />
  );
};
