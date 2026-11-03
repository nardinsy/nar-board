import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { boardRepository } from '@/services';
import { applyTaskUpdate } from '../helpers/taskUpdates';

import { Task, UpdateTaskDto } from '../types';

type UpdateTaskVariables = { taskId: string; data: UpdateTaskDto };

export const useUpdateTask = (boardId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['tasks', boardId];

  return useMutation({
    mutationFn: ({ taskId, data }: UpdateTaskVariables) => boardRepository.updateTask(taskId, data),

    onMutate: async ({ taskId, data }) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<Task[]>(queryKey);

      queryClient.setQueryData<Task[]>(queryKey, (old) =>
        old ? applyTaskUpdate(old, taskId, data) : old
      );

      return { previous };
    },

    onError: (_error, variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);

      toast.error(`Failed to update ${variables.data.title?.slice(10)}. Please try again`);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
