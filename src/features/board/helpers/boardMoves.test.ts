import { describe, it, expect } from 'vitest';
import {
  applyColumnUpdates,
  diffColumns,
  resolveDropColumn,
  findColumnByTaskId,
  moveToColumn,
  reorderInColumn,
} from './boardMoves';
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
    expect(findColumnByTaskId(columns, 'c')?.status).toBe('in-progress');
  });

  it('returns undefined for an unknown task', () => {
    expect(findColumnByTaskId(columns, 'zzz')).toBeUndefined();
  });
});

describe('findColumnOfId', () => {
  it('finds a column by its own status', () => {
    expect(resolveDropColumn(columns, 'done')?.status).toBe('done');
  });

  it('finds the column of a task id', () => {
    expect(resolveDropColumn(columns, 'a')?.status).toBe('todo');
  });

  it('returns undefined for an unknown id', () => {
    expect(resolveDropColumn(columns, 'zzz')).toBeUndefined();
  });
});

describe('moveToColumn', () => {
  it('moves a task into an empty column', () => {
    const result = moveToColumn(columns, 'a', 'done', null, false);
    expect(result.find((c) => c.status === 'done')!.tasks.map((t) => t.id)).toEqual(['a']);
    expect(result.find((c) => c.status === 'todo')!.tasks.map((t) => t.id)).toEqual(['b']);
  });

  it('updates the status of the moved task', () => {
    const result = moveToColumn(columns, 'a', 'done', null, false);
    expect(result.find((c) => c.status === 'done')!.tasks[0].status).toBe('done');
  });

  it('inserts before the hovered task', () => {
    const result = moveToColumn(columns, 'a', 'in-progress', 'c', false);
    expect(result[1].tasks.map((t) => t.id)).toEqual(['a', 'c']);
  });

  it('inserts after the hovered task', () => {
    const result = moveToColumn(columns, 'a', 'in-progress', 'c', true);
    expect(result[1].tasks.map((t) => t.id)).toEqual(['c', 'a']);
  });

  it('appends when overId is not a task in the target column', () => {
    const result = moveToColumn(columns, 'a', 'in-progress', 'in-progress', false);
    expect(result[1].tasks.map((t) => t.id)).toEqual(['c', 'a']);
  });

  it('does nothing when moving within the same column', () => {
    expect(moveToColumn(columns, 'a', 'todo', 'b', false)).toBe(columns);
  });

  it('does nothing for an unknown task', () => {
    expect(moveToColumn(columns, 'zzz', 'done', null, false)).toBe(columns);
  });

  it('is safe to call twice (no duplicates)', () => {
    const once = moveToColumn(columns, 'a', 'done', null, false);
    const twice = moveToColumn(once, 'a', 'done', null, false);
    expect(twice).toBe(once);
  });

  it('does not mutate the input', () => {
    const before = JSON.stringify(columns);
    moveToColumn(columns, 'a', 'done', null, false);
    expect(JSON.stringify(columns)).toBe(before);
  });

  it('keeps the same reference for untouched columns', () => {
    const result = moveToColumn(columns, 'a', 'done', null, false);
    expect(result[1]).toBe(columns[1]); // in-progress was not touched
  });
});

describe('reorderInColumn', () => {
  it('moves a task to the position of the task it is dropped on', () => {
    const result = reorderInColumn(columns, 'a', 'b');
    expect(result[0].tasks.map((t) => t.id)).toEqual(['b', 'a']);
  });

  it('does nothing when dropped on itself', () => {
    expect(reorderInColumn(columns, 'a', 'a')).toBe(columns);
  });

  it('does nothing when overId is not in the same column', () => {
    expect(reorderInColumn(columns, 'a', 'c')).toBe(columns);
  });

  it('does nothing for an unknown task', () => {
    expect(reorderInColumn(columns, 'zzz', 'a')).toBe(columns);
  });

  it('keeps other columns untouched', () => {
    const result = reorderInColumn(columns, 'a', 'b');
    expect(result[1]).toBe(columns[1]);
  });

  it('does not mutate the input', () => {
    const before = JSON.stringify(columns);
    reorderInColumn(columns, 'a', 'b');
    expect(JSON.stringify(columns)).toBe(before);
  });

  it('works after a card has crossed columns', () => {
    // this is the scenario your old handleDragEnd got wrong
    const crossed = moveToColumn(columns, 'a', 'in-progress', 'c', true); // [c, a]
    const result = reorderInColumn(crossed, 'a', 'c');
    expect(result[1].tasks.map((t) => t.id)).toEqual(['a', 'c']);
  });
});

describe('diffColumns', () => {
  it('returns nothing when nothing changed', () => {
    expect(diffColumns(columns, columns)).toEqual([]);
  });

  it('returns only the column that was reordered', () => {
    const after = reorderInColumn(columns, 'a', 'b');
    expect(diffColumns(columns, after)).toEqual([{ status: 'todo', taskIds: ['b', 'a'] }]);
  });

  it('returns both columns after a cross-column move', () => {
    const after = moveToColumn(columns, 'a', 'done', null, false);
    expect(diffColumns(columns, after)).toEqual([
      { status: 'todo', taskIds: ['b'] },
      { status: 'done', taskIds: ['a'] },
    ]);
  });

  it('returns nothing when a card is moved away and back', () => {
    const away = moveToColumn(columns, 'a', 'done', null, false);
    const back = moveToColumn(away, 'a', 'todo', 'a', false);
    // order may differ from the original, so only check the unchanged column
    expect(diffColumns(columns, back).find((c) => c.status === 'done')).toBeUndefined();
  });
});

describe('applyColumnUpdates', () => {
  const tasks = columns.flatMap((c) => c.tasks); // a, b (todo), c (in-progress)

  it('reorders tasks inside a column', () => {
    const result = applyColumnUpdates(tasks, [{ status: 'todo', taskIds: ['b', 'a'] }]);
    expect(result.filter((t) => t.status === 'todo').map((t) => t.id)).toEqual(['b', 'a']);
  });

  it('changes the status of a moved task', () => {
    const result = applyColumnUpdates(tasks, [
      { status: 'todo', taskIds: ['b'] },
      { status: 'in-progress', taskIds: ['c', 'a'] },
    ]);
    expect(result.find((t) => t.id === 'a')!.status).toBe('in-progress');
    expect(result.filter((t) => t.status === 'in-progress').map((t) => t.id)).toEqual(['c', 'a']);
  });

  it('never loses or duplicates tasks', () => {
    const result = applyColumnUpdates(tasks, [{ status: 'todo', taskIds: ['b', 'a'] }]);
    expect(result).toHaveLength(tasks.length);
  });

  it('keeps the reference of tasks whose status did not change', () => {
    const result = applyColumnUpdates(tasks, [{ status: 'todo', taskIds: ['b', 'a'] }]);
    expect(result.find((t) => t.id === 'c')).toBe(tasks.find((t) => t.id === 'c'));
  });
});
