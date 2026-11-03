import { ColumnStatus, Label, Priority } from '../board/types';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  label: Label;
  status: ColumnStatus;
  assigneeId: string;
  boardId: string;
  createdAt: string;
  dueDate?: string;
}

export interface CreateTaskDto {
  title: string;
  priority: Priority;
  label: Label;
  status: ColumnStatus;
  boardId: string;
  description?: string;
  dueDate?: string;
}

export type UpdateTaskDto = Partial<Omit<Task, 'id' | 'createdAt' | 'boardId'>>;
