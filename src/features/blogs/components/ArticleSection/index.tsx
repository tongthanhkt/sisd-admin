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
                          <div className='flex items-center gap-2 px-2 py-1'>
                            <AccordionTrigger className='flex min-w-0 flex-1 flex-row-reverse items-center px-0'>
                              <div className='w-full truncate text-left'>
                                {articleSections[index]?.headline ||
                                  `Article Section ${index + 1}`}
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
