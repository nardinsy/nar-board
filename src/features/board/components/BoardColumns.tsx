import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { ColumnData } from '../types';
import { BoardColumn } from './BoardColumn';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useUpdateColumnOrder } from '../hooks/useUpdateColumnOrder';
import { TaskOverLay } from '@/features/tasks/components/TaskOverLay';
import { Task } from '@/features/tasks/types';
import { diffColumns, findColumnOfId, moveToColumn, reorderInColumn } from '../helpers/boardMoves';

export const BoardColumns = ({
  columnsData,
  boardId,
  isLoading,
}: {
  columnsData: ColumnData[];
  boardId: string;
  isLoading: boolean;
}) => {
  const [draft, setDraft] = useState<{ base: ColumnData[]; columns: ColumnData[] } | null>(null);
  const [activeItem, setActiveItem] = useState<Task | null>(null);

  // the cache changed after the drop, so it now has our result: discard the draft
  const cacheCaughtUp = draft !== null && activeItem === null && draft.base !== columnsData;
  if (cacheCaughtUp) setDraft(null);

  const columns = draft && !cacheCaughtUp ? draft.columns : columnsData;

  const { mutate } = useUpdateColumnOrder(boardId);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setDraft({ base: columnsData, columns: columnsData });
    setActiveItem(event.active.data.current?.task);
  };

  const handleDragCancel = () => {
    setDraft(null);
    setActiveItem(null);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const translated = active.rect.current.translated;
    const insertAfter = !!translated && translated.top > over.rect.top + over.rect.height / 2;

    setDraft((prev) => {
      if (!prev) return prev;
      const overColumn = findColumnOfId(prev.columns, overId);
      if (!overColumn) return prev;
      const next = moveToColumn(prev.columns, activeId, overColumn.status, overId, insertAfter);
      return next === prev.columns ? prev : { ...prev, columns: next };
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
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

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      autoScroll={{
        threshold: {
          x: 0.2,
          y: 0.2,
        },
        acceleration: 10,
      }}
    >
      {columns.map((column) => (
        <BoardColumn
          key={column.status}
          status={column.status}
          tasks={column.tasks}
          boardId={boardId}
          isLoading={isLoading}
        />
      ))}

      <DragOverlay
        dropAnimation={{
          duration: 150,
        }}
      >
        {activeItem ? <TaskOverLay task={activeItem} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
