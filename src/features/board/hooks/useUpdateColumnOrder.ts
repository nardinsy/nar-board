import { useMutation, useQueryClient } from '@tanstack/react-query';

import { boardRepository } from '@/services';
import { ColumnUpdate } from '../types';
import { applyColumnUpdates } from '../helpers/boardMoves';
import { toast } from 'sonner';
import { Task } from '@/features/tasks/types';

export const useUpdateColumnOrder = (boardId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['tasks', boardId];

  return useMutation({
    mutationFn: (updates: ColumnUpdate[]) => boardRepository.updateColumnOrder(updates),
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey }); // stop in-flight refetches overwriting us
      const previous = queryClient.getQueryData<Task[]>(queryKey);
      queryClient.setQueryData<Task[]>(queryKey, (old) =>
        old ? applyColumnUpdates(old, updates) : old
      );
      return { previous };
    },

    onError: (_error, _updates, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      toast.error('Failed to move task. Please try again.');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
