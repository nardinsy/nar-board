import type { ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';

import { boardRepository } from '@/services';
import { useUpdateColumnOrder } from './useUpdateColumnOrder';
import type { Task } from '@/features/tasks/types';
import type { ColumnStatus } from '../types';

vi.mock('@/services', () => ({
  boardRepository: { updateColumnOrder: vi.fn() },
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
  const { result } = renderHook(() => useUpdateColumnOrder('b1'), { wrapper });
  return { client, result };
};

const todoIds = (client: QueryClient) =>
  client
    .getQueryData<Task[]>(KEY)!
    .filter((t) => t.status === 'todo')
    .map((t) => t.id);

beforeEach(() => vi.clearAllMocks());

describe('useUpdateColumnOrder', () => {
  it('updates the cache immediately, before the server answers', async () => {
    let finish!: () => void;
    vi.mocked(boardRepository.updateColumnOrder).mockReturnValue(
      new Promise<void>((resolve) => {
        finish = resolve;
      })
    );
    const { client, result } = setup();

    act(() => {
      result.current.mutate([{ status: 'todo', taskIds: ['b', 'a'] }]);
    });

    await waitFor(() => expect(todoIds(client)).toEqual(['b', 'a']));
    finish();
  });

  it('restores the previous cache and shows a toast when the server fails', async () => {
    vi.mocked(boardRepository.updateColumnOrder).mockRejectedValue(new Error('fail'));
    const { client, result } = setup();

    act(() => {
      result.current.mutate([{ status: 'todo', taskIds: ['b', 'a'] }]);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(client.getQueryData(KEY)).toEqual(initial);
    expect(toast.error).toHaveBeenCalled();
  });

  it('keeps the new order when the server succeeds', async () => {
    vi.mocked(boardRepository.updateColumnOrder).mockResolvedValue(undefined);
    const { client, result } = setup();

    act(() => {
      result.current.mutate([{ status: 'todo', taskIds: ['b', 'a'] }]);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(todoIds(client)).toEqual(['b', 'a']);
  });
});
