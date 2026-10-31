import { DndContext, DragOverlay } from '@dnd-kit/core';

import { useBoardDnd } from '../hooks/useBoardDnd';
import { BoardColumn } from './BoardColumn';
import { TaskOverLay } from '@/features/tasks/components/TaskOverLay';

import { ColumnData } from '../types';

const AUTO_SCROLL = { threshold: { x: 0.2, y: 0.2 }, acceleration: 10 };
const DROP_ANIMATION = { duration: 350 };

export const BoardColumns = ({
  columnsData,
  boardId,
  isLoading,
}: {
  columnsData: ColumnData[];
  boardId: string;
  isLoading: boolean;
}) => {
  const { columns, activeItem, dndProps } = useBoardDnd(columnsData, boardId);

  return (
    <DndContext {...dndProps} autoScroll={AUTO_SCROLL}>
      {columns.map((column) => (
        <BoardColumn
          key={column.status}
          status={column.status}
          tasks={column.tasks}
          boardId={boardId}
          isLoading={isLoading}
        />
      ))}

      <DragOverlay dropAnimation={DROP_ANIMATION}>
        {activeItem ? <TaskOverLay task={activeItem} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
