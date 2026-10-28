import { Task } from '../tasks/types';

export type Priority = 'low' | 'medium' | 'high';
export type Label = 'feature' | 'bug' | 'docs' | 'perf';
export type ColumnStatus = 'todo' | 'in-progress' | 'in-review' | 'done';

export interface Column {
  id: string;
  title: string;
  status: ColumnStatus;
  taskIds: string[];
}

export interface ColumnData {
  status: ColumnStatus;
  tasks: Task[];
}

export type BoardColumns = ColumnData[];

export interface Board {
  id: string;
  title: string;
  columns: Column[];
  createdAt: string;
}
