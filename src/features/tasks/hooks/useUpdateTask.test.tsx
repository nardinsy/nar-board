import { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { boardRepository } from '@/services';
import { ColumnStatus } from '@/features/board/types';
import { Task } from '../types';
import { useUpdateTask } from './useUpdateTask';

vi.mock('@/services', () => ({
  boardRepository: { updateTask: vi.fn() },
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
  const { result } = renderHook(() => useUpdateTask('b1'), { wrapper });
  return { client, result };
};

const cached = (client: QueryClient) => client.getQueryData<Task[]>(KEY)!;

beforeEach(() => vi.clearAllMocks());

describe('useUpdateTask', () => {
  it('updates the cache immediately, before the server answers', async () => {
    let finish!: (t: Task) => void;
    vi.mocked(boardRepository.updateTask).mockReturnValue(
      new Promise<Task>((resolve) => {
        finish = resolve;
      })
    );
    const { client, result } = setup();

    act(() => {
      result.current.mutate({ taskId: 'a', data: { title: 'New' } });
    });

    await waitFor(() => expect(cached(client)[0].title).toBe('New'));
    finish({ ...initial[0], title: 'New' });
  });

  it('moves the task to the end of the new column when the status changes', async () => {
    let finish!: (t: Task) => void;
    vi.mocked(boardRepository.updateTask).mockReturnValue(
      new Promise<Task>((resolve) => {
        finish = resolve;
      })
    );
    const { client, result } = setup();

    act(() => {
      result.current.mutate({ taskId: 'a', data: { status: 'in-progress' } });
    });

    await waitFor(() =>
      expect(cached(client).map((t) => [t.id, t.status])).toEqual([
        ['b', 'todo'],
        ['c', 'in-progress'],
        ['a', 'in-progress'],
      ])
    );
    finish({ ...initial[0], status: 'in-progress' });
  });

  it('restores the previous cache and shows a toast when the server fails', async () => {
    vi.mocked(boardRepository.updateTask).mockRejectedValue(new Error('fail'));
    const { client, result } = setup();

    act(() => {
      result.current.mutate({ taskId: 'a', data: { title: 'New' } });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(cached(client)).toEqual(initial);
    expect(toast.error).toHaveBeenCalled();
  });

  it('keeps the edit when the server succeeds', async () => {
    vi.mocked(boardRepository.updateTask).mockResolvedValue({ ...initial[0], title: 'New' });
    const { client, result } = setup();

    act(() => {
      result.current.mutate({ taskId: 'a', data: { title: 'New' } });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(cached(client)[0].title).toBe('New');
  });
});
