import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UploadMultipleIImage } from '@/components/UploadMultipleIImage';
import { IUploadMultipleImageItem } from '@/types';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { BlogFormValues } from '../../utils/form-schema';
import { ArticleContent } from '../ArticleContents';
import { BlogSubHeading } from '../BlogSubHeading';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { SortableSpecItem } from '@/components/SortableSpecItem';
import { useSortableList } from '@/hooks/use-sortable-list';
import { GripVerticalIcon, Trash2Icon, ChevronDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ArticleSection = () => {
  const methods = useFormContext<BlogFormValues>();
  const { control, watch, setValue } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'articleSections'
  });

  const { sensors, handleDragEnd, removeItem } = useSortableList({
    items: fields.map((f, i) => ({ ...f, ...watch('articleSections')[i] })),
    onItemsChange: (newItems) => {
      setValue('articleSections', newItems);
    }
  });

  return (
    <FormField
      control={control}
      name='articleSections'
      render={({ field }) => {
        const articleSections = watch('articleSections');
        return (
          <FormItem>
            <FormLabel>Article Sections</FormLabel>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={fields.map((f) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <Accordion type='multiple' className='mb-4'>
                  {fields.map((field, index) => (
                    <SortableSpecItem key={field.id} id={field.id}>
                      {(listeners) => (
                        <AccordionItem value={`item-${field.id}`}>
                          <AccordionTrigger className='group flex items-center justify-between gap-2'>
                            <div className='flex flex-1 items-center gap-2'>
                              <span className='truncate'>
                                {articleSections[index]?.headline ||
                                  `Article Section ${index + 1}`}
                              </span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <Button
                                variant='ghost'
                                size='icon'
                                type='button'
                                tabIndex={-1}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeItem(index);
                                }}
                                className='hover:bg-red-50'
                              >
                                <Trash2Icon className='size-4 text-red-500' />
                              </Button>
                              <button
                                type='button'
                                {...listeners}
                                tabIndex={-1}
                                className='hover:bg-accent cursor-grab rounded p-1'
                                onClick={(e) => e.stopPropagation()}
                              >
                                <GripVerticalIcon className='size-4' />
                              </button>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className='space-y-4 rounded-lg border border-solid p-4'>
                              <FormField
                                control={control}
                                name={`articleSections.${index}.headline`}
                                render={({ field }) => (
                                  <Input
                                    label='Headline'
                                    placeholder='Enter headline'
                                    {...field}
                                  />
                                )}
                              />
                              <FormField
                                control={control}
                                name={`articleSections.${index}.headline2`}
                                render={({ field }) => (
                                  <Input
                                    label='Headline 2'
                                    placeholder='Enter headline 2'
                                    {...field}
                                  />
                                )}
                              />
                              <UploadMultipleIImage
                                label='Images'
                                value={articleSections[index].images || []}
                                onValueChange={(files) => {
                                  setValue(
                                    `articleSections.${index}.images`,
                                    files as IUploadMultipleImageItem[]
                                  );
                                }}
                                cardClassName='h-40'
                                listClassName='lg:grid-cols-5'
                                withCaption
                              />
                              <ArticleContent
                                name={`articleSections.${index}.contents`}
                              />
                              <BlogSubHeading
                                name={`articleSections.${index}.subHeadline`}
                              />
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )}
                    </SortableSpecItem>
                  ))}
                </Accordion>
              </SortableContext>
            </DndContext>
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
              Add article
            </Button>
          </FormItem>
        );
      }}
    />
  );
};
