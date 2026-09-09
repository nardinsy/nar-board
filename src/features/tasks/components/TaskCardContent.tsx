import { formatISODate } from '@/utils/date';
import { Label, Priority } from '@/features/board/types';
import { Task } from '../types';
import React from 'react';

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
    <span
      className={`${labelVariants[label]} inline-flex items-center rounded-lg px-2 py-1 text-xs`}
    >
      {label}
    </span>
  );
};

const TaskDueDate = ({ date }: { date: string }) => {
  return <div className="text-muted-foreground text-xs">{formatISODate(date)}</div>;
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

// TODO: I can put user's avarat instead of username nice
const TaskAssignee = () => {
  return (
    <div className="w-6 h-6 flex justify-center items-center rounded-full bg-sky-100 text-sky-800 text-xs font-medium">
      AD
    </div>
  );
};

export const TaskCardContent = React.memo(({ task }: { task: Task }) => {
  return (
    <>
      <h3 className="font-semibold text-sm text-foreground">{task.title}</h3>
      <div className="flex gap-2 items-center">
        <TaskLabel label={task.label} />
        {task.dueDate && <TaskDueDate date={task.dueDate} />}
        <TaskPriority priority={task.priority} />
        <TaskAssignee />
      </div>
    </>
  );
});
