import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { tasksQueryOptions } from '../queries';

import { Task } from '../types';

interface Options<TData, TVariables> {
  boardId: string;
  mutationFn: (variables: TVariables) => Promise<TData>;
  applyOptimistic: (tasks: Task[], variables: TVariables) => Task[];
  errorMessage: string;
}

export const useOptimisticTaskMutatuion = <TData, TVariables>({
  boardId,
  mutationFn,
  applyOptimistic,
  errorMessage,
}: Options<TData, TVariables>) => {
  const queryClient = useQueryClient();
  const queryKey = tasksQueryOptions(boardId).queryKey;

  return useMutation({
    mutationFn,

    onMutate: async (variables: TVariables) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<Task[]>(queryKey);
      queryClient.setQueryData<Task[]>(queryKey, (old) =>
        old ? applyOptimistic(old, variables) : old
      );

      return { previous };
    },

    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      toast.error(errorMessage);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
