import NoData from '@/components/NoData';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
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
  useWatch
} from 'react-hook-form';
import { BlogFormValues } from '../../utils/form-schema';
import { ArticleContent } from '../ArticleContents';

function SortableSubHeading({
  id,
  index,
  name,
  remove,
  control,
  fields
}: {
  id: string;
  index: number;
  name: FieldArrayPath<BlogFormValues>;
  remove: (index: number) => void;
  control: any;
  fields: any[];
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

  const watchedTitle = useWatch({ name: `${name}.${index}.title` });
  const watchedSubTitle = useWatch({ name: `${name}.${index}.subTitle` });

  const preview = useMemo(() => {
    if (!watchedTitle && !watchedSubTitle) return `Sub Heading ${index + 1}`;
    return `${watchedTitle || ''}${watchedSubTitle ? ' - ' + watchedSubTitle : ''}`.slice(
      0,
      60
    );
  }, [watchedTitle, watchedSubTitle, index]);

  return (
    <AccordionItem value={id}>
      <div
        ref={setNodeRef}
        style={style}
        className='flex items-center gap-2 px-2 py-1'
      >
        <AccordionTrigger className='flex min-w-0 flex-1 flex-row-reverse items-center px-0'>
          <div className='w-full truncate text-left'>{preview}</div>
        </AccordionTrigger>
        <div className='flex flex-shrink-0 items-center'>
          <Button
            variant='ghost'
            size='icon'
            type='button'
            tabIndex={-1}
            onClick={() => remove(index)}
            className='ml-1 text-red-500 hover:bg-red-50'
          >
            <Trash2Icon className='size-5' />
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
            control={control}
            name={`${name}.${index}.title` as FieldPath<BlogFormValues>}
            render={({ field }) => <Input {...field} label='Title' />}
          />
          <FormField
            control={control}
            name={`${name}.${index}.subTitle` as FieldPath<BlogFormValues>}
            render={({ field }) => <Input {...field} label='Sub Title' />}
          />
          <ArticleContent
            name={`${name}.${index}.contents` as FieldArrayPath<BlogFormValues>}
            contentClassName='mx-6'
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export const BlogSubHeading = ({
  name
}: {
  name: FieldArrayPath<BlogFormValues>;
}) => {
  const { control } = useFormContext<BlogFormValues>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name
  });

  const handleDragEnd = (event: DragEndEvent) => {
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
    <FormItem>
      <FormLabel>Sub Heading</FormLabel>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <Accordion type='multiple' className='flex flex-col gap-2'>
            {fields?.length > 0 ? (
              fields.map((field, index) => (
                <SortableSubHeading
                  key={field.id}
                  id={field.id}
                  index={index}
                  name={name}
                  remove={remove}
                  control={control}
                  fields={fields}
                />
              ))
            ) : (
              <NoData />
            )}
          </Accordion>
        </SortableContext>
      </DndContext>
      <Button
        variant='outline'
        onClick={() =>
          append({
            title: '',
            subTitle: '',
            contents: []
          })
        }
        type='button'
        className='ml-auto w-fit'
      >
        <PlusIcon className='size-4' /> Add sub heading
      </Button>
    </FormItem>
  );
};
