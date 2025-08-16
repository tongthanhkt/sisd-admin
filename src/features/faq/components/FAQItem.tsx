import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
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
import { useMemo } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { FAQFormValues } from '../utils/form-schema';
import { FAQContent } from './FAQContent';

export const FAQItem = () => {
  const methods = useFormContext<FAQFormValues>();
  const { control } = methods;
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'body'
  });

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over?.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        move(oldIndex, newIndex);
      }
    }
  };

  const removeItem = (index: number) => {
    remove(index);
  };

  const body = fields;

  // Watch form values to get realtime updates
  const watchedBody = useWatch({
    control,
    name: 'body'
  });

  const previewQuestion = useMemo(() => {
    const currentBody = watchedBody || body;
    return currentBody.map((section, index: number) => {
      const question = section?.question;
      if (!question || question.trim() === '') {
        return `Question ${index + 1}`;
      }
      return question.length > 50 ? `${question.slice(0, 50)}...` : question;
    });
  }, [watchedBody, body]);

  return (
    <FormField
      control={control}
      name='body'
      render={() => {
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
                items={body.map((section) => section.id)}
                strategy={verticalListSortingStrategy}
              >
                <Accordion type='multiple' className='mb-4'>
                  {body?.length > 0 ? (
                    body.map((section, index: number) => (
                      <SortableSpecItem key={section.id} id={section.id}>
                        {(listeners) => (
                          <AccordionItem value={`item-${section.id}`}>
                            <div className='flex items-center gap-2 px-2 py-1'>
                              <AccordionTrigger className='flex min-w-0 flex-1 flex-row-reverse items-center px-0'>
                                <div className='w-full truncate text-left'>
                                  {previewQuestion[index]}
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
                                  render={({
                                    field,
                                    fieldState: { error }
                                  }) => (
                                    <Input
                                      label='Question'
                                      placeholder='Enter question'
                                      {...field}
                                      error={!!error}
                                      helperText={error?.message}
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
                  id: Math.random().toString(),
                  contents: [],
                  question: ''
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
