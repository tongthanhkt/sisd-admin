import {
  useSensors,
  useSensor,
  PointerSensor,
  DragEndEvent
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useCallback } from 'react';

// Generic interface for items with id
interface SortableItem {
  id: string;
  [key: string]: any;
}

interface UseSortableListOptions<T extends SortableItem> {
  items: T[];
  onItemsChange: (items: T[]) => void;
}

export function useSortableList<T extends SortableItem>({
  items,
  onItemsChange
}: UseSortableListOptions<T>) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (active.id !== over?.id) {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          onItemsChange(arrayMove(items, oldIndex, newIndex));
        }
      }
    },
    [items, onItemsChange]
  );

  const addItem = useCallback(
    (newItem: Omit<T, 'id'>) => {
      const itemWithId: T = {
        ...newItem,
        id: `${Date.now()}-${Math.random()}`
      } as T;
      onItemsChange([...items, itemWithId]);
    },
    [items, onItemsChange]
  );

  const updateItem = useCallback(
    (index: number, updates: Partial<T>) => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], ...updates };
      onItemsChange(newItems);
    },
    [items, onItemsChange]
  );

  const removeItem = useCallback(
    (index: number) => {
      onItemsChange(items.filter((_, i) => i !== index));
    },
    [items, onItemsChange]
  );

  return {
    sensors,
    handleDragEnd,
    addItem,
    updateItem,
    removeItem
  };
}
