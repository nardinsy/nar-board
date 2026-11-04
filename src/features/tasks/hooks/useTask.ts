import { useQuery } from '@tanstack/react-query';
import { tasksQueryOptions } from '../queries';

export const useTask = (boardId: string, taskId: string) => {
  return useQuery({
    ...tasksQueryOptions(boardId),
    select: (tasks) => tasks.find((t) => t.id === taskId),
  });
};
