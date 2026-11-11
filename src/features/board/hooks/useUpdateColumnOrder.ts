import { boardRepository } from '@/services';
import { applyColumnUpdates } from '../helpers/boardMoves';

import { ColumnUpdate } from '../types';
import { useOptimisticTaskMutatuion } from '@/features/tasks/hooks/useOptimisticTaskMutation';

export const useUpdateColumnOrder = (boardId: string) => {
  return useOptimisticTaskMutatuion<void, ColumnUpdate[]>({
    boardId,
    mutationFn: (updates) => boardRepository.updateColumnOrder(updates),
    applyOptimistic: applyColumnUpdates,
    errorMessage: 'Failed to move task. Please try again.',
  });
  // const queryClient = useQueryClient();
  // // const queryKey = ['tasks', boardId];
  // const queryKey = tasksQueryOptions(boardId).queryKey;
  // return useMutation({
  //   mutationFn: (updates: ColumnUpdate[]) => boardRepository.updateColumnOrder(updates),
  //   onMutate: async (updates) => {
  //     await queryClient.cancelQueries({ queryKey }); // stop in-flight refetches overwriting us
  //     const previous = queryClient.getQueryData<Task[]>(queryKey);
  //     queryClient.setQueryData<Task[]>(queryKey, (old) =>
  //       old ? applyColumnUpdates(old, updates) : old
  //     );
  //     return { previous };
  //   },
  //   onError: (_error, _updates, context) => {
  //     if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
  //     toast.error('Failed to move task. Please try again.');
  //   },
  //   onSettled: () => {
  //     queryClient.invalidateQueries({ queryKey });
  //   },
  // });
};
