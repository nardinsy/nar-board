import { useState } from 'react';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useUpdateColumnOrder } from '../hooks/useUpdateColumnOrder';
import {
  diffColumns,
  resolveDropColumn,
  moveToColumn,
  reorderInColumn,
} from '../helpers/boardMoves';

import { Task } from '@/features/tasks/types';
import { ColumnData } from '../types';

type Draft = { base: ColumnData[]; columns: ColumnData[] };

export const useBoardDnd = (columnsData: ColumnData[], boardId: string) => {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [activeItem, setActiveItem] = useState<Task | null>(null);

  const { mutate } = useUpdateColumnOrder(boardId);

  // the cache changed after the drop, so it now has our result: discard the draft
  const cacheCaughtUp = draft !== null && activeItem === null && draft.base !== columnsData;

  if (cacheCaughtUp) setDraft(null);

  const columns = draft && !cacheCaughtUp ? draft.columns : columnsData;

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    setDraft({ base: columnsData, columns: columnsData });
    setActiveItem(event.active.data.current?.task);
  };

  const onDragCancel = () => {
    setDraft(null);
    setActiveItem(null);
  };

  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const translated = active.rect.current.translated;
    const insertAfter = !!translated && translated.top > over.rect.top + over.rect.height / 2;

    setDraft((prev) => {
      if (!prev) return prev;
      const overColumn = resolveDropColumn(prev.columns, overId);
      if (!overColumn) return prev;
      const next = moveToColumn(prev.columns, activeId, overColumn.status, overId, insertAfter);
      return next === prev.columns ? prev : { ...prev, columns: next };
    });
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveItem(null);

    if (!draft || !over) {
      setDraft(null); //  dropped outside: the cache was never touched, so just discard the draft
      return;
    }

    const next = reorderInColumn(columns, String(active.id), String(over.id));
    const updates = diffColumns(draft.base, next);

    if (updates.length === 0) {
      setDraft(null); // nothing changed, nothing to wait for
      return;
    }

    setDraft({ base: draft.base, columns: next }); // keep showing the result
    mutate(updates); // when the cache updates, cacheCaughtUp discards the draft
  };

  return {
    columns,
    activeItem,
    dndProps: {
      sensors,
      onDragStart,
      onDragCancel,
      onDragOver,
      onDragEnd,
    },
  };
};
