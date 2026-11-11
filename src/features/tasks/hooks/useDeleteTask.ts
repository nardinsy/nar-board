import { boardRepository } from '@/services';
import { removeTask } from '../helpers/taskUpdates';
import { useOptimisticTaskMutatuion } from './useOptimisticTaskMutation';

export const useDeleteTask = (boardId: string) => {
  return useOptimisticTaskMutatuion<void, string>({
    boardId,
    mutationFn: (id: string) => boardRepository.deleteTask(id),
    applyOptimistic: removeTask,
    errorMessage: 'Failed to delete task. Please try again',
  });

  // const queryClient = useQueryClient();
  // const queryKey = tasksQueryOptions(boardId).queryKey;

  // return useMutation({
  //   mutationFn: (id: string) => boardRepository.deleteTask(id),

  //   onMutate: async (id: string) => {
  //     await queryClient.cancelQueries({ queryKey });

  //     const previous = queryClient.getQueryData<Task[]>(queryKey);
  //     queryClient.setQueryData<Task[]>(queryKey, (old) => (old ? removeTask(old, id) : old));

  //     return { previous };
  //   },

  //   onError: (_error, id, context) => {
  //     if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
  //     toast.error(`Failed to delete task with id ${id}. Please try again`);
  //   },

  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey });
  //   },
  // });
};
