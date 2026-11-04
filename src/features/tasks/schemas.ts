import { z } from 'zod';
import { CreateTaskDto, UpdateTaskDto } from './types';

export const newTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  priority: z.enum(['low', 'medium', 'high']),
  label: z.enum(['feature', 'bug', 'docs', 'perf']),
  status: z.enum(['todo', 'in-progress', 'in-review', 'done']),
  boardId: z.string(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
}) satisfies z.ZodType<CreateTaskDto>;

export type NewTaskFormData = z.infer<typeof newTaskSchema>;

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  priority: z.enum(['low', 'medium', 'high']),
  label: z.enum(['feature', 'bug', 'docs', 'perf']),
  status: z.enum(['todo', 'in-progress', 'in-review', 'done']),
  description: z.string().optional(),
  dueDate: z.string().optional(),
}) satisfies z.ZodType<UpdateTaskDto>;

export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
