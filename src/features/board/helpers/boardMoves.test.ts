import { describe, it, expect } from 'vitest';
import { findColumnOfId, findColumnOfTask } from './boardMoves';
import { ColumnData, ColumnStatus } from '../types';
import { Task } from '@/features/tasks/types';

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

const columns: ColumnData[] = [
  { status: 'todo', tasks: [task('a', 'todo'), task('b', 'todo')] },
  { status: 'in-progress', tasks: [task('c', 'in-progress')] },
  { status: 'in-review', tasks: [] },
  { status: 'done', tasks: [] },
];

describe('findColumnOfTask', () => {
  it('finds the column that contains the task', () => {
    expect(findColumnOfTask(columns, 'c')?.status).toBe('in-progress');
  });

  it('returns undefined for an unknown task', () => {
    expect(findColumnOfTask(columns, 'zzz')).toBeUndefined();
  });
});

describe('findColumnOfId', () => {
  it('finds a column by its own status', () => {
    expect(findColumnOfId(columns, 'done')?.status).toBe('done');
  });

  it('finds the column of a task id', () => {
    expect(findColumnOfId(columns, 'a')?.status).toBe('todo');
  });

  it('returns undefined for an unknown id', () => {
    expect(findColumnOfId(columns, 'zzz')).toBeUndefined();
  });
});
