import React, { useRef, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { ColumnData, ColumnStatus } from '../types';
import { BoardColumn } from './BoardColumn';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useUpdateColumnOrder } from '../hooks/useUpdateColumnOrder';
import { TaskOverLay } from '@/features/tasks/components/TaskOverLay';
import { Task } from '@/features/tasks/types';
import { toast } from 'sonner';
import { findColumnOfId, findColumnOfTask } from '../helpers/boardMoves';

export const BoardColumns = ({
  columnsData,
  boardId,
  isLoading,
  scrollPositions,
  onScroll,
}: {
  columnsData: ColumnData[];
  boardId: string;
  isLoading: boolean;
  scrollPositions: React.RefObject<Record<string, number>>;
  onScroll: (columnId: string, scrollTop: number) => void;
}) => {
  const [columns, setColumns] = useState<ColumnData[]>(columnsData);
  const [activeItem, setActiveItem] = useState<Task | null>(null);
  const snapshotRef = useRef<ColumnData[] | null>(null);

  const { mutate } = useUpdateColumnOrder(boardId);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateColumns = (updates: { status: ColumnStatus; taskIds: string[] }[]) => {
    mutate(updates, {
      onError: () => {
        setColumns(columnsData);
        toast.error('Failed to move task. Please try again.');
      },
    });
  };

  // const findColumnId = (item: Active | Over): UniqueIdentifier | undefined => {
  //   if (columns.some((col) => col.id === item.id)) {
  //     // for over, which means column itself (empty column)
  //     return item.id;
  //   }
  //   return item.data.current?.columnId;
  // };

  const handleDragStart = (event: DragStartEvent) => {
    snapshotRef.current = columns;
    setActiveItem(event.active.data.current?.task);
  };

  const handleDragCancel = () => {
    if (snapshotRef.current) setColumns(snapshotRef.current);
    snapshotRef.current = null;
    setActiveItem(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeColumn = findColumnOfTask(columns, activeId);
    const overColumn = findColumnOfId(columns, overId);

    if (!activeColumn || !overColumn) return;

    // handled in drag-end event
    if (activeColumn.status === overColumn.status && activeId !== overId) return;

    if (activeColumn.status === overColumn.status) return;

    // activeColumnId !== overColumnId
    setColumns((prev) => {
      // const activeColumn = prev.find((col) => col.status === activeColumn.status);
      if (!activeColumn) return prev;

      if (!activeItem) return prev;
      const updatedTask = { ...activeItem, status: overColumn.status };

      return prev.map((column) => {
        if (column.status === activeColumn.status) {
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== activeId),
          };
        }

        if (column.status === overColumn.status) {
          const overTaskIndex = column.tasks.findIndex((task) => task.id === overId);
          if (overId === overColumn.status || overTaskIndex === -1) {
            return {
              ...column,
              tasks: [...column.tasks, updatedTask],
            };
          }

          const isBelowOverItem =
            active.rect.current.translated &&
            active.rect.current.translated.top > over.rect.top + over.rect.height / 2;

          const newIndex = isBelowOverItem ? overTaskIndex + 1 : overTaskIndex;
          const newTasks = [...column.tasks];
          newTasks.splice(newIndex, 0, updatedTask);
          return { ...column, tasks: newTasks };
        }

        return column;
      });
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      if (snapshotRef.current) setColumns(snapshotRef.current);
      snapshotRef.current = null;
      setActiveItem(null);
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeColumn = activeItem?.status;
    const overColumn = findColumnOfId(columns, overId);

    if (!activeColumn || !overColumn) {
      setActiveItem(null);
      return;
    }

    if (activeColumn === overColumn.status && activeId !== overId) {
      const columnIndex = columns.findIndex((col) => col.status === activeColumn);

      if (columnIndex === -1) {
        setActiveItem(null);
        return;
      }

      const column = columns[columnIndex];
      const activeIndex = column.tasks.findIndex((task) => task.id === activeId);
      const overIndex = column.tasks.findIndex((task) => task.id === overId);

      if (activeIndex !== -1 && overIndex !== -1) {
        const newTasks = arrayMove(column.tasks, activeIndex, overIndex);

        setColumns((prev) => {
          return prev.map((column, i) => {
            if (i === columnIndex) {
              return { ...column, tasks: newTasks };
            }
            return column;
          });
        });

        updateColumns([{ status: overColumn.status, taskIds: newTasks.map((task) => task.id) }]);
      }
    }

    if (activeColumn !== overColumn.status && overId) {
      const sourceCol = columns.find((col) => col.status === activeColumn);
      const destCol = columns.find((col) => col.status === overColumn.status);

      if (!sourceCol || !destCol) return;

      updateColumns([
        {
          status: activeColumn as ColumnStatus,
          taskIds: sourceCol.tasks.map((task) => task.id),
        },
        {
          status: overColumn.status,
          taskIds: destCol.tasks.map((task) => task.id),
        },
      ]);
    }

    snapshotRef.current = null;
    setActiveItem(null);
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
          id={column.status}
          key={column.status}
          status={column.status}
          tasks={column.tasks}
          boardId={boardId}
          isLoading={isLoading}
          scrollPositions={scrollPositions.current?.[column.status] ?? 0}
          onScroll={onScroll}
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
