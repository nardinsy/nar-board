import clsx from 'clsx';
import { Priority } from '@/features/board/types';
import { TaskCardContent } from './TaskCardContent';
import { Task } from '../types';

const cardBorderVariants: Record<Priority, string> = {
  low: 'border border-green-600',
  medium: 'border border-amber-600',
  high: 'border border-red-600',
};

export const TaskOverLay = ({ task }: { task: Task }) => {
  return (
    <li
      className={clsx(
        `task-card-wrapper cursor-grabbing touch-none}`,
        cardBorderVariants[task.priority]
      )}
    >
      <TaskCardContent task={task} />
    </li>
  );
};
