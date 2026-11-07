import { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { toast } from 'sonner';

import { useDeleteTask } from './useDeleteTask';
import { boardRepository } from '@/services';
import { ColumnStatus } from '@/features/board/types';
import { Task } from '../types';

vi.mock('@/services', () => ({
  boardRepository: { deleteTask: vi.fn() },
}));
vi.mock('sonner', () => ({ toast: { error: vi.fn() } }));

const KEY = ['tasks', 'b1'];

const task = (id: string, status: ColumnStatus): Task => ({
  id,
  status,
  title: id,
  priority: 'low',
  label: 'feature',
  assigneeId: 'u1',
  boardId: 'b1',
  createdAt: '2026-01-01',
});

const initial = [task('a', 'todo'), task('b', 'todo'), task('c', 'in-progress')];

const setup = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  client.setQueryData(KEY, initial);

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  const { result } = renderHook(() => useDeleteTask('b1'), { wrapper });
  return { client, result };
};

const cached = (client: QueryClient) => client.getQueryData<Task[]>(KEY)!;

beforeEach(() => vi.clearAllMocks());
describe('useDeleteTask', () => {
  it('removes the task from the cache immediately, before the server answers', async () => {
    let finish!: () => void;
    vi.mocked(boardRepository.deleteTask).mockReturnValue(
      new Promise<void>((resolve) => {
        finish = resolve;
      })
    );
    const { client, result } = setup();

    act(() => {
      result.current.mutate('a');
    });

    await waitFor(() => expect(cached(client).map((t) => t.id)).toEqual(['b', 'c']));
    finish();
  });

  it('restores the previous cache and shows a toast when the server fails', async () => {
    vi.mocked(boardRepository.deleteTask).mockRejectedValue(new Error('fail'));
    const { client, result } = setup();

    act(() => {
      result.current.mutate('a');
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(cached(client)).toEqual(initial);
    expect(toast.error).toHaveBeenCalled();
  });

  it('keeps the task removed when the server succeeds', async () => {
    vi.mocked(boardRepository.deleteTask).mockResolvedValue(undefined);
    const { client, result } = setup();

    act(() => {
      result.current.mutate('a');
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(cached(client).map((t) => t.id)).toEqual(['b', 'c']);
  });
});
