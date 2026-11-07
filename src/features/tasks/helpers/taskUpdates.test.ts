import { describe, it, expect } from 'vitest';
import { applyTaskUpdate, removeTask } from './taskUpdates';
import { Task } from '../types';

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: '1',
  title: 'Task',
  priority: 'low',
  label: 'feature',
  status: 'todo',
  assigneeId: 'u1',
  boardId: 'b1',
  createdAt: '2024-01-01',
  ...overrides,
});

describe('applyTaskUpdate', () => {
  const a = makeTask({ id: 'a' });
  const b = makeTask({ id: 'b' });
  const c = makeTask({ id: 'c', status: 'done' });

  it('updates fields and keeps other tasks by reference', () => {
    const result = applyTaskUpdate([a, b, c], 'b', { title: 'New' });

    expect(result[1]).toEqual({ ...b, title: 'New' });
    expect(result[0]).toBe(a);
    expect(result[2]).toBe(c);
  });

  it('keeps the position when the status does not change', () => {
    const result = applyTaskUpdate([a, b, c], 'a', { priority: 'high' });

    expect(result.map((t) => t.id)).toEqual(['a', 'b', 'c']);
  });

  it('moves the task to the end when the status changes', () => {
    const result = applyTaskUpdate([a, b, c], 'a', { status: 'done' });

    expect(result.map((t) => t.id)).toEqual(['b', 'c', 'a']);
    expect(result[2].status).toBe('done');
  });

  it('returns the same array for an unknown id', () => {
    const tasks = [a, b];
    expect(applyTaskUpdate(tasks, 'nope', { title: 'X' })).toBe(tasks);
  });

  it('returns the same array when nothing changes', () => {
    const tasks = [a, b];
    expect(applyTaskUpdate(tasks, 'a', { title: a.title })).toBe(tasks);
  });

  it('does not mutate the input', () => {
    const tasks = [a, b];
    applyTaskUpdate(tasks, 'a', { status: 'done' });

    expect(tasks).toEqual([a, b]);
    expect(a.status).toBe('todo');
  });
});

describe('removeTask', () => {
  const a = makeTask({ id: 'a' });
  const b = makeTask({ id: 'b' });
  const c = makeTask({ id: 'c', status: 'done' });

  it('removes the task and keeps the others by reference', () => {
    const result = removeTask([a, b, c], 'b');

    expect(result).toHaveLength(2);
    expect(result[0]).toBe(a);
    expect(result[1]).toBe(c);
  });

  it('does not mutate the input', () => {
    const tasks = [a, b];
    removeTask(tasks, 'a');

    expect(tasks).toEqual([a, b]);
  });
});
