import NoData from '@/components/NoData';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { FormField, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UploadMultipleIImage } from '@/components/UploadMultipleIImage';
import { BlogFormValues } from '@/features/blogs/utils/form-schema';
import { cn } from '@/lib/utils';
import { IUploadMultipleImageItem } from '@/types';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVerticalIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useMemo } from 'react';
import {
  FieldArrayPath,
  FieldPath,
  useFieldArray,
  useFormContext,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form';

export const ArticleContent = ({
  name,
  contentClassName
}: {
  name: FieldArrayPath<BlogFormValues>;
  contentClassName?: string;
}) => {
  const { control, setValue, watch } = useFormContext<BlogFormValues>();
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
          items={fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <Accordion
            type='multiple'
            className={cn('flex flex-col gap-2', contentClassName)}
          >
            {fields?.length > 0 ? (
              fields.map((field, index) => (
                <SortableItem
                  key={field.id}
                  id={field.id}
                  index={index}
                  name={name}
                  remove={remove}
                  setValue={setValue}
                  watch={watch}
                  isAccordion
                />
              ))
            ) : (
              <NoData />
            )}
          </Accordion>
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

function SortableItem({
  id,
  index,
  name,
  remove,
  setValue,
  watch,
  isAccordion
}: {
  id: string;
  index: number;
  name: FieldArrayPath<BlogFormValues>;
  remove: (index: number) => void;
  setValue: UseFormSetValue<BlogFormValues>;
  watch: UseFormWatch<BlogFormValues>;
  isAccordion?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const imagesValue = watch(
    `${name}.${index}.images` as FieldPath<BlogFormValues>
  );

  const content = watch(
    `${name}.${index}.content` as FieldPath<BlogFormValues>
  );

  const preview = useMemo(() => {
    if (!content || content.trim() === '') {
      return `Content ${index + 1}`;
    }
    return content.length > 50 ? `${content.slice(0, 50)}...` : content;
  }, [content, index]);

  if (!isAccordion) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className='flex gap-2 rounded-lg border border-solid border-neutral-200 bg-white p-4'
      >
        <div className='flex flex-1 flex-col gap-4'>
          <FormField
            key={id}
            control={undefined as any}
            name={`${name}.${index}.content` as FieldPath<BlogFormValues>}
            render={({ field }) => <Textarea {...field} />}
          />
          <UploadMultipleIImage
            value={imagesValue || []}
            onValueChange={(images) => {
              setValue(
                `${name}.${index}.images` as FieldPath<BlogFormValues>,
                images as IUploadMultipleImageItem[]
              );
            }}
            cardClassName='h-40'
            listClassName='lg:grid-cols-5'
            withCaption
            label='Images'
          />
        </div>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => remove(index)}
          className='h-8 w-8'
          type='button'
        >
          <Trash2Icon className='size-5 text-red-600' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          className='h-8 w-8 cursor-grab'
          {...attributes}
          {...listeners}
        >
          <GripVerticalIcon className='size-5' />
        </Button>
      </div>
    );
  }

  // Accordion style
  return (
    <AccordionItem value={id}>
      <div
        ref={setNodeRef}
        style={style}
        className='flex items-center gap-2 px-2 py-1'
      >
        <AccordionTrigger className='flex min-w-0 flex-1 flex-row-reverse items-center px-0'>
          <div className='w-full truncate text-left'>
            {preview.slice(0, 100)}
          </div>
        </AccordionTrigger>
        <div className='flex flex-shrink-0 items-center'>
          <Button
            variant='ghost'
            size='icon'
            type='button'
            tabIndex={-1}
            onClick={() => remove(index)}
            className='ml-1 hover:bg-red-50'
          >
            <Trash2Icon className='size-5 text-red-600' />
          </Button>
          <button
            type='button'
            {...attributes}
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
        <div className='flex flex-1 flex-col gap-4'>
          <FormField
            key={id}
            control={undefined as any}
            name={`${name}.${index}.content` as FieldPath<BlogFormValues>}
            render={({ field }) => <Textarea {...field} />}
          />
          <UploadMultipleIImage
            value={imagesValue || []}
            onValueChange={(images) => {
              setValue(
                `${name}.${index}.images` as FieldPath<BlogFormValues>,
                images as IUploadMultipleImageItem[]
              );
            }}
            cardClassName='h-40'
            listClassName='lg:grid-cols-5'
            withCaption
            label='Images'
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
