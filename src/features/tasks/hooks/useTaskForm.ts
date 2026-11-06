import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskFormSchema, TaskFormData } from '../schemas';

export const useTaskForm = (defaultValues: TaskFormData) => {
  return useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
  });
};
