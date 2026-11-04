import { Task } from '@/features/tasks/types';
import { COLUMN_STATUSES } from '../constants';
import { ColumnData } from '../types';
import { useQuery } from '@tanstack/react-query';
import { tasksQueryOptions } from '@/features/tasks/queries';

export const groupByStatus = (tasks: Task[]): ColumnData[] =>
  COLUMN_STATUSES.map((status) => ({
    status,
    tasks: tasks.filter((t) => t.status === status),
  }));

export const useBoardColumns = (boardId: string) =>
  useQuery({
    ...tasksQueryOptions(boardId),
    select: groupByStatus, // module-level function, so its reference is stable
  });
