import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useNavigate } from 'react-router-dom';
import { UniqueIdentifier, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import clsx from 'clsx';
import { Plus } from 'lucide-react';

import { TaskCard } from '@/features/tasks/components/TaskCard';
import { ColumnStatus } from '../types';
import { Task } from '@/features/tasks/types';

import { ROUTE_BUILDERS } from '@/router/routes';
import { Button } from '@/components/ui';

const statusIconVariants: Record<ColumnStatus, string> = {
  'in-progress': 'bg-sky-300',
  'in-review': 'bg-orange-400',
  done: 'bg-green-500',
  todo: 'bg-gray-300',
};

const statusTitleVariants: Record<ColumnStatus, string> = {
  'in-progress': 'In Progress',
  'in-review': 'In Review',
  done: 'Done',
  todo: 'Todo',
};

export const BoardColumn = ({
  id,
  status,
  tasks,
  boardId,
  isLoading,
  scrollPositions,
  onScroll,
}: {
  id: UniqueIdentifier;
  status: ColumnStatus;
  tasks: Task[];
  boardId: string;
  isLoading: boolean;
  scrollPositions: number;
  onScroll: (columnId: string, scrollTop: number) => void;
}) => {
  const { setNodeRef } = useDroppable({ id });
  const navigate = useNavigate();
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 110,
    overscan: 5,
    initialOffset: scrollPositions,
  });

  const content =
    tasks.length === 0 ? (
      <div className="flex justify-center py-8 text-foreground text-sm">No task yet</div>
    ) : (
      <div
        ref={(node) => {
          setNodeRef(node);
          parentRef.current = node;
        }}
        onScroll={(e) => onScroll(status, e.currentTarget.scrollTop)}
        className="overflow-y-auto scrollbar-thin scrollbar-track-secondary scrollbar-thumb-foreground"
      >
        <ul style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const task = tasks[virtualItem.index];
            return (
              <li
                key={task.id}
                style={{
                  position: 'absolute',
                  top: virtualItem.start,
                  width: '100%',
                }}
              >
                <TaskCard id={task.id} task={task} />
              </li>
            );
          })}
        </ul>
      </div>
    );

  return (
    <section
      ref={setNodeRef}
      className="flex flex-col gap-3 bg-secondary rounded-xl p-3 min-w-72 max-h-[calc(100vh-100px)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={clsx('w-2.5 h-2.5 rounded-full', statusIconVariants[status])} />
          <h2 className="text-sm font-medium text-secondary-foreground">
            {statusTitleVariants[status]}
          </h2>
          <span className="text-sm text-gray-400 bg-white rounded-full px-2 py-0.5 border border-gray-200">
            {tasks.length}
          </span>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(ROUTE_BUILDERS.createTask(boardId!, status))}
          className="p-1 transition-none"
          aria-label="Add task"
        >
          <Plus size={14} />
        </Button>
      </div>

      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        {isLoading ? (
          <div className="flex justify-center py-8 text-foreground text-sm">Loading ...</div>
        ) : (
          content
        )}
      </SortableContext>
    </section>
  );
};
