import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { UpdateTaskFormData, updateTaskSchema } from '../schemas';
import { Task } from '../types';

export const useUpdateTaskForm = (task: Task) => {
  return useForm<UpdateTaskFormData>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description ?? '',
      label: task.label,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ?? '',
    },
  });
};
