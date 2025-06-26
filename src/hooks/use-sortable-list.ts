import {
  useSensors,
  useSensor,
  PointerSensor,
  DragEndEvent
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useCallback, useRef } from 'react';

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
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        const oldIndex = itemsRef.current.findIndex(
          (item) => item.id === active.id
        );
        const newIndex = itemsRef.current.findIndex(
          (item) => item.id === over?.id
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          const newItems = arrayMove(itemsRef.current, oldIndex, newIndex);
          onItemsChange(newItems);
        }
      }
    },
    [onItemsChange]
  );

  const addItem = useCallback(
    (newItem: Omit<T, 'id'>) => {
      const itemWithId: T = {
        ...newItem,
        id:
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`
      } as T;

      onItemsChange([...itemsRef.current, itemWithId]);
    },
    [onItemsChange]
  );

  const updateItem = useCallback(
    (index: number, updates: Partial<T>) => {
      const currentItems = itemsRef.current;
      const item = currentItems[index];
      if (!item) return;

      // Only update if there are actual changes
      const hasChanges = Object.keys(updates).some(
        (key) => item[key] !== updates[key]
      );
      if (!hasChanges) return;

      const newItems = [...currentItems];
      newItems[index] = { ...item, ...updates };
      onItemsChange(newItems);
    },
    [onItemsChange]
  );

  const removeItem = useCallback(
    (index: number) => {
      const newItems = itemsRef.current.filter((_, i) => i !== index);
      onItemsChange(newItems);
    },
    [onItemsChange]
  );

  const ensureItemIds = useCallback((itemsToProcess: any[]): T[] => {
    return (itemsToProcess || []).map((item) => {
      if (typeof item === 'string') {
        return {
          id:
            typeof crypto !== 'undefined' && crypto.randomUUID
              ? crypto.randomUUID()
              : `${Date.now()}-${Math.random()}`,
          value: item
        } as unknown as T;
      }

      return {
        ...item,
        id:
          item.id ||
          (typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`)
      } as T;
    });
  }, []);

  return {
    sensors,
    handleDragEnd,
    addItem,
    updateItem,
    removeItem,
    ensureItemIds
  };
}
