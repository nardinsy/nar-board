import { ColumnData } from '../types';

export const findColumnOfTask = (columns: ColumnData[], taskId: string) =>
  columns.find((column) => column.tasks.some((task) => task.id === taskId));

export const findColumnOfId = (columns: ColumnData[], id: string) =>
  columns.find((column) => column.status === id) ?? findColumnOfTask(columns, id);
