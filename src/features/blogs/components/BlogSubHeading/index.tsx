import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  FieldPath,
  Path,
  useFieldArray,
  useFormContext,
  useWatch
} from 'react-hook-form';
import { BlogFormValues } from '../../utils/form-schema';
import { PlusIcon, Trash2Icon, GripVerticalIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArticleContent } from '../ArticleContents';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';
import { useMemo } from 'react';

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
  name: Path<BlogFormValues>;
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
            name={`${name}.${index}.contents` as Path<BlogFormValues>}
            contentClassName='mx-6'
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export const BlogSubHeading = ({ name }: { name: Path<BlogFormValues> }) => {
  const { control } = useFormContext<BlogFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name
  });
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Sub Heading</FormLabel>
          <DndContext collisionDetection={closestCenter}>
            <SortableContext
              items={fields.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <Accordion type='multiple' className='flex flex-col gap-2'>
                {fields.map((field, index) => (
                  <SortableSubHeading
                    key={field.id}
                    id={field.id}
                    index={index}
                    name={name}
                    remove={remove}
                    control={control}
                    fields={fields}
                  />
                ))}
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
      )}
    />
  );
};
