import { queryOptions } from '@tanstack/react-query';
import { boardRepository } from '@/services';

export const tasksQueryOptions = (boardId: string) =>
  queryOptions({
    queryKey: ['tasks', boardId],
    queryFn: () => boardRepository.getTasks(boardId),
  });
