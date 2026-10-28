import { Task } from '@/features/tasks/types';
import { ColumnData, ColumnStatus, ColumnUpdate } from '../types';

export const findColumnOfTask = (columns: ColumnData[], taskId: string) =>
  columns.find((column) => column.tasks.some((task) => task.id === taskId));

export const findColumnOfId = (columns: ColumnData[], id: string) =>
  columns.find((column) => column.status === id) ?? findColumnOfTask(columns, id);

export const moveToColumn = (
  columns: ColumnData[],
  taskId: string,
  toStatus: ColumnStatus,
  overId: string | null, // the task we're hovering, or null/column id = append at the end
  insertAfter: boolean
): ColumnData[] => {
  const from = findColumnOfTask(columns, taskId);
  const to = columns.find((column) => column.status === toStatus);

  // nothing to do: unknown task, unknown column, or already there
  if (!from || !to || from.status === to.status) return columns;

  const task = from.tasks.find((t) => t.id === taskId)!;
  const overIndex = overId ? to.tasks.findIndex((t) => t.id === overId) : -1;
  const index = overIndex === -1 ? to.tasks.length : overIndex + (insertAfter ? 1 : 0);

  return columns.map((column) => {
    if (column.status === from.status) {
      return { ...column, tasks: column.tasks.filter((t) => t.id !== taskId) };
    }
    if (column.status === to.status) {
      const moved = { ...task, status: to.status };
      return {
        ...column,
        tasks: [...column.tasks.slice(0, index), moved, ...column.tasks.slice(index)],
      };
    }
    return column;
  });
};

const moveItem = <T>(items: T[], from: number, to: number): T[] => {
  const copy = [...items];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
};

export const reorderInColumn = (
  columns: ColumnData[],
  taskId: string,
  overId: string
): ColumnData[] => {
  const column = findColumnOfTask(columns, taskId);
  if (!column) return columns;

  const from = column.tasks.findIndex((t) => t.id === taskId);
  const to = column.tasks.findIndex((t) => t.id === overId);

  // overId is not a task in this column, or nothing would change
  if (to === -1 || from === to) return columns;

  return columns.map((c) =>
    c.status === column.status ? { ...c, tasks: moveItem(c.tasks, from, to) } : c
  );
};

const sameIds = (a: Task[], b: Task[]) =>
  a.length === b.length && a.every((task, i) => task.id === b[i].id);

export const diffColumns = (before: ColumnData[], after: ColumnData[]) =>
  after
    .filter((column) => {
      const old = before.find((c) => c.status === column.status);
      if (old === column) return false; // same reference: untouched, skip
      return !old || !sameIds(old.tasks, column.tasks);
    })
    .map((column) => ({
      status: column.status,
      taskIds: column.tasks.map((t) => t.id),
    }));

export const applyColumnUpdates = (tasks: Task[], updates: ColumnUpdate[]): Task[] => {
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const touchedIds = new Set(updates.flatMap((u) => u.taskIds));

  const untouched = tasks.filter((t) => !touchedIds.has(t.id));
  const touched = updates.flatMap((u) =>
    u.taskIds
      .map((id) => byId.get(id))
      .filter((t): t is Task => !!t)
      .map((t) => (t.status === u.status ? t : { ...t, status: u.status }))
  );

  return [...untouched, ...touched];
};
