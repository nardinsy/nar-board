import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pen } from 'lucide-react';

import { Label, Priority } from '@/features/board/types';
import { Button } from '@/components/ui';
import { formatISODate } from '@/utils/date';

import { Task } from '../types';
import { ROUTE_BUILDERS } from '@/router/routes';

const labelVariants: Record<Label, string> = {
  bug: 'bg-red-100 text-red-700',
  feature: 'bg-sky-200 text-sky-800',
  perf: 'bg-amber-100 text-amber-700',
  docs: 'bg-green-100 text-green-800',
};

const priorityTextVariants: Record<Priority, string> = {
  low: 'text-green-600',
  medium: 'text-amber-600',
  high: 'text-red-600',
};

const TaskLabel = ({ label }: { label: Label }) => {
  return (
    <span className={`${labelVariants[label]} flex justify-center rounded-lg p-2 text-xs`}>
      {label}
    </span>
  );
};

const TaskDueDate = ({ date }: { date: string }) => {
  return <div className="text-muted-foreground text-xs w-12">{formatISODate(date)}</div>;
};

const TaskPriority = ({ priority }: { priority: Priority }) => {
  return (
    <div
      className={`${priorityTextVariants[priority]} text-xs font-medium`}
      aria-label={`Priority: ${priority}`}
    >
      {priority}
    </div>
  );
};

// TODO: Avarat instead of username, nice
const TaskAssignee = () => {
  return (
    <div className="w-6 h-6 flex justify-center items-center rounded-full bg-sky-100 text-sky-800 text-xs font-medium">
      AD
    </div>
  );
};

export const TaskCardContent = memo(({ task }: { task: Task }) => {
  const navigate = useNavigate();

  return (
    <>
      <h3 className="font-semibold text-sm text-foreground pb-2 line-clamp-2 overflow-hidden whitespace-pre-wrap wrap-break-word">
        {task.title}
      </h3>
      <div className="flex items-center justify-between gap-1">
        <TaskLabel label={task.label} />
        {task.dueDate ? (
          <TaskDueDate date={task.dueDate} />
        ) : (
          <div aria-hidden="true" className="w-12" />
        )}
        <TaskPriority priority={task.priority} />
        <TaskAssignee />
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(ROUTE_BUILDERS.updateTask(task.boardId, task.id))}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') e.stopPropagation();
          }}
          className="p-2"
          aria-label="Update task"
        >
          <Pen size={14} />
        </Button>
      </div>
    </>
  );
});
