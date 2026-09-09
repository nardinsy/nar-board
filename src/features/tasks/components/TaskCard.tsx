import { useSortable } from '@dnd-kit/sortable';
import { UniqueIdentifier } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';

import { TaskCardContent } from './TaskCardContent';
import { Priority } from '@/features/board/types';
import { Task } from '../types';

const cardBorderVariants: Record<Priority, string> = {
  low: 'border border-green-600',
  medium: 'border border-amber-600',
  high: 'border border-red-600',
};

export const TaskCard = ({ id, task }: { id: UniqueIdentifier; task: Task }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: {
      task,
      columnId: task.status,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx(
        `w-full min-h-24 flex flex-col justify-between rounded-2xl p-2 bg-background shadow-sm cursor-grab active:cursor-grabbing ${isDragging ? 'z-10 shadow-md opacity-50' : ''}`,
        cardBorderVariants[task.priority]
      )}
    >
      <TaskCardContent task={task} />
    </div>
  );
};
