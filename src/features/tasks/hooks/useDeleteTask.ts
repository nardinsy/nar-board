import { useMutation, useQueryClient } from '@tanstack/react-query';

import { boardRepository } from '@/services';
import { tasksQueryOptions } from '../queries';
import { Task } from '../types';
import { removeTask } from '../helpers/taskUpdates';
import { toast } from 'sonner';

export const useDeleteTask = (boardId: string) => {
  const queryClient = useQueryClient();
  const queryKey = tasksQueryOptions(boardId).queryKey;

  return useMutation({
    mutationFn: (id: string) => boardRepository.deleteTask(id),

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<Task[]>(queryKey);
      queryClient.setQueryData<Task[]>(queryKey, (old) => (old ? removeTask(old, id) : old));

      return { previous };
    },

    onError: (_error, id, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      toast.error(`Failed to delete task with id ${id}. Please try again`);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
