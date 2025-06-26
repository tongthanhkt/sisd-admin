import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

export const SortableSpecItem = ({
  id,
  children
}: {
  id: string;
  children: ((listeners: any) => React.ReactNode) | React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'default'
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {typeof children === 'function' ? children(listeners) : children}
    </div>
  );
};
