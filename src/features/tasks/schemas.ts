import { z } from 'zod';
import { CreateTaskDto } from './types';

export const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  priority: z.enum(['low', 'medium', 'high']),
  label: z.enum(['feature', 'bug', 'docs', 'perf']),
  status: z.enum(['todo', 'in-progress', 'in-review', 'done']),
  description: z.string().optional(),
  dueDate: z.string().optional(),
}) satisfies z.ZodType<Omit<CreateTaskDto, 'boardId'>>;

export type TaskFormData = z.infer<typeof taskFormSchema>;
