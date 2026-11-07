import { Task, UpdateTaskDto } from '../types';

export const applyTaskUpdate = (tasks: Task[], id: string, data: UpdateTaskDto): Task[] => {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return tasks;

  const current = tasks[index];
  const changed = (Object.keys(data) as (keyof UpdateTaskDto)[]).some(
    (key) => data[key] !== current[key]
  );
  if (!changed) return tasks;

  const updated: Task = { ...current, ...data };

  if (updated.status === current.status) {
    return tasks.map((t, i) => (i === index ? updated : t));
  }

  // status changed: move to the end of new column
  return [...tasks.slice(0, index), ...tasks.slice(index + 1), updated];
};

export const removeTask = (tasks: Task[], taskId: string): Task[] => {
  if (!tasks.some((t) => t.id === taskId)) return tasks;

  return tasks.filter((t) => t.id !== taskId);
};
