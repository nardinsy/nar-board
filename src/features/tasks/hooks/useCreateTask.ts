import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { boardRepository } from '@/services';
import { tasksQueryOptions } from '../queries';

import { CreateTaskDto } from '@/features/tasks/types';

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskDto) => boardRepository.createTask(data),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: tasksQueryOptions(data.boardId).queryKey });
    },
    onError: () => toast.error('Failed to create task. Please try again.'),
  });
};
