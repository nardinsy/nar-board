import { describe, it, expect, beforeEach } from 'vitest';
import { Task } from '@/features/tasks/types';
import { MockBoardRepository } from './board.mock';
import { Board, ColumnStatus } from '@/features/board/types';

const DUMMY_TASKS_TEST: Task[] = [
  {
    id: 'task-1',
    title: 'First',
    description: 'Description',
    priority: 'medium',
    label: 'feature',
    status: 'todo',
    assigneeId: '1',
    boardId: 'test_board',
    createdAt: '2026-06-01T09:00:00Z',
    dueDate: '2026-06-20T09:00:00Z',
  },
  {
    id: 'task-2',
    title: 'Second',
    description: 'Description',
    priority: 'high',
    label: 'perf',
    status: 'todo',
    assigneeId: '1',
    boardId: 'test_board',
    createdAt: '2026-06-01T09:00:00Z',
    dueDate: '2026-06-20T09:00:00Z',
  },
];

const DUMMY_BOARD_TEST: Board = {
  id: 'test_board',
  title: 'Project-1',
  columns: [
    { id: 'col-1', title: 'Todo', status: 'todo', taskIds: ['task-2', 'task-1'] },
    { id: 'col-2', title: 'In Progress', status: 'in-progress', taskIds: [] },
    { id: 'col-3', title: 'In Review', status: 'in-review', taskIds: [] },
    { id: 'col-4', title: 'Done', status: 'done', taskIds: [] },
  ],
  createdAt: '2026-06-01T09:00:00Z',
};

describe('MockBoardRepository', () => {
  let repo: MockBoardRepository;
  beforeEach(() => {
    repo = new MockBoardRepository(
      structuredClone(DUMMY_BOARD_TEST),
      structuredClone(DUMMY_TASKS_TEST)
    );
  });

  it('getTasks returns tasks in taskIds order, not array order', async () => {
    const tasks = await repo.getTasks('test_board');
    expect(tasks[0].id).toBe('task-2');
  });

  it('getTasks throws when boardId is invalid', async () => {
    await expect(repo.getTasks('test_board_not_valid')).rejects.toThrow('Board not found');
  });

  it('updateColumnOrder updates task status when moved to new column', async () => {
    await repo.updateColumnOrder([
      { status: 'todo', taskIds: ['task-2'] }, // task-1 removed
      { status: 'in-progress', taskIds: ['task-1'] }, // task-1 added
    ]);

    const boardTasks = await repo.getTasks('test_board');
    expect(boardTasks.find((task) => task.id === 'task-1')?.status).toBe('in-progress');
    expect(boardTasks.find((task) => task.id === 'task-2')?.status).toBe('todo');

    expect(boardTasks[0].id).toBe('task-2');
    expect(boardTasks[1].id).toBe('task-1');
  });

  it('delete tasks from column', async () => {
    await repo.deleteTask('task-1');

    const boardTasks = await repo.getTasks('test_board');
    const tasksIdByStatus = await repo.getTasksIdByStatus('todo');

    expect(boardTasks.find((task) => task.id === 'task-1')).toBe(undefined);
    expect(tasksIdByStatus.find((id) => id === 'task-1')).toBe(undefined);
  });

  it('updateTask moves the task to the end of the new column when status changes', async () => {
    await repo.updateTask('task-2', { status: 'in-progress' });

    const tasks = await repo.getTasks('test_board');
    expect(tasks.map((t) => [t.id, t.status])).toEqual([
      ['task-1', 'todo'],
      ['task-2', 'in-progress'],
    ]);
  });

  it('updateTask keeps the position when the status does not change', async () => {
    await repo.updateTask('task-2', { title: 'Renamed' });

    const tasks = await repo.getTasks('test_board');
    expect(tasks.map((t) => t.id)).toEqual(['task-2', 'task-1']);
    expect(tasks[0].title).toBe('Renamed');
  });

  it('updateTask throws for an unknown id', async () => {
    await expect(repo.updateTask('nope', { title: 'X' })).rejects.toThrow('not found');
  });

  it('updateTask changes nothing when the new column does not exist', async () => {
    await expect(repo.updateTask('task-2', { status: 'nope' as ColumnStatus })).rejects.toThrow(
      'not found'
    );

    const tasks = await repo.getTasks('test_board');
    expect(tasks.map((t) => [t.id, t.status])).toEqual([
      ['task-2', 'todo'],
      ['task-1', 'todo'],
    ]);
  });
});

// const DUMMY_TASKS_TEST: Task[] = [
//   {
//     id: 'task-1',
//     title: 'Setup CI/CD pipeline',
//     description: 'Description',
//     priority: 'medium',
//     label: 'feature',
//     status: 'in-progress',
//     assigneeId: '1',
//     boardId: 'board-1',
//     createdAt: '2026-06-01T09:00:00Z',
//     dueDate: '2026-06-20T09:00:00Z',
//   },
//   {
//     id: 'task-2',
//     title: 'Implement drag and drop',
//     description: 'Description',
//     priority: 'high',
//     label: 'perf',
//     status: 'in-review',
//     assigneeId: '1',
//     boardId: 'board-1',
//     createdAt: '2026-06-01T09:00:00Z',
//     dueDate: '2026-06-20T09:00:00Z',
//   },
//   {
//     id: 'task-3',
//     title: 'Write API documentation',
//     description: 'Description',
//     priority: 'low',
//     label: 'docs',
//     status: 'done',
//     assigneeId: '1',
//     boardId: 'board-1',
//     createdAt: '2026-06-01T09:00:00Z',
//     dueDate: '2026-06-20T09:00:00Z',
//   },
//   {
//     id: 'task-4',
//     title: 'Fix search performance bug',
//     description: 'Description',
//     priority: 'low',
//     label: 'bug',
//     status: 'todo',
//     assigneeId: '1',
//     boardId: 'board-1',
//     createdAt: '2026-06-01T09:00:00Z',
//     dueDate: '2026-06-20T09:00:00Z',
//   },
//   {
//     id: 'task-5',
//     title: 'Auth token refresh logic',
//     description: 'Description',
//     priority: 'high',
//     label: 'perf',
//     status: 'done',
//     assigneeId: '1',
//     boardId: 'board-1',
//     createdAt: '2026-06-01T09:00:00Z',
//     dueDate: '2026-06-20T09:00:00Z',
//   },
//   {
//     id: 'task-6',
//     title: 'Add dark mode support',
//     description: 'Description',
//     priority: 'low',
//     label: 'docs',
//     status: 'in-progress',
//     assigneeId: '1',
//     boardId: 'board-1',
//     createdAt: '2026-06-01T09:00:00Z',
//     dueDate: '2026-06-20T09:00:00Z',
//   },
//   {
//     id: 'task-7',
//     title: 'Write unit tests for auth',
//     description: 'Description',
//     priority: 'medium',
//     label: 'docs',
//     status: 'in-review',
//     assigneeId: '1',
//     boardId: 'board-1',
//     createdAt: '2026-06-01T09:00:00Z',
//     dueDate: '2026-06-20T09:00:00Z',
//   },
//   {
//     id: 'task-8',
//     title: 'Fix mobile layout issues',
//     description: 'Description',
//     priority: 'high',
//     label: 'bug',
//     status: 'todo',
//     assigneeId: '1',
//     boardId: 'board-1',
//     createdAt: '2026-06-01T09:00:00Z',
//     dueDate: '2026-06-20T09:00:00Z',
//   },
// ];

// const DUMMY_BOARD_TEST: Board = {
//   id: 'board-1',
//   title: 'Project-1',
//   columns: [
//     { id: 'col-1', title: 'Todo', status: 'todo', taskIds: ['task-4', 'task-8'] },
//     { id: 'col-2', title: 'In Progress', status: 'in-progress', taskIds: ['task-1', 'task-6'] },
//     { id: 'col-3', title: 'In Review', status: 'in-review', taskIds: ['task-2', 'task-7'] },
//     { id: 'col-4', title: 'Done', status: 'done', taskIds: ['task-3', 'task-5'] },
//   ],
//   createdAt: '2026-06-01T09:00:00Z',
// };
