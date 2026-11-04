import { useMutation, useQueryClient } from '@tanstack/react-query';

import { boardRepository } from '@/services';
import { tasksQueryOptions } from '../queries';

export const useDeleteTask = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => boardRepository.deleteTask(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksQueryOptions(boardId).queryKey });
    },
  });
};
