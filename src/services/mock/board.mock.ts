import { IBoardRepository } from '../interfaces/board.interface';
import { Board, ColumnStatus, ColumnUpdate } from '@/features/board/types';
import { CreateTaskDto, Task, UpdateTaskDto } from '@/features/tasks/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createTaskFromDto = (dto: CreateTaskDto, assigneeId: string = '1'): Task => {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    assigneeId,
    ...dto,
  };
};

export class MockBoardRepository implements IBoardRepository {
  private board: Board;
  private tasks: Task[];

  constructor(board: Board, tasks: Task[]) {
    this.board = board;
    this.tasks = tasks;
  }

  private addToBoard(status: ColumnStatus, taskId: string) {
    const column = this.board.columns.find((col) => col.status === status);
    if (!column) throw new Error(`Column with status "${status}" not found`);
    column.taskIds.push(taskId);
  }

  private deleteFromBoard(status: ColumnStatus, taskId: string) {
    const column = this.board.columns.find((col) => col.status === status);
    if (!column) throw new Error(`Column with status "${status}" not found`);
    column.taskIds = column.taskIds.filter((task) => task !== taskId);
  }

  async createTask(data: CreateTaskDto): Promise<Task> {
    const task = createTaskFromDto(data);
    this.tasks.push(task);

    this.addToBoard(task.status, task.id);

    await delay(0);
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) throw new Error('Task not found');
    this.deleteFromBoard(task.status, id);
    // DUMMY_TASKS = DUMMY_TASKS.filter((task) => task.id !== id);
    // TODO I keep deleted task in DUMMY_TASK for now, Fix this

    await delay(0);
  }

  async getBoard(boardId: string): Promise<Board> {
    if (this.board.id !== boardId) throw new Error('Board not found');

    await delay(0);
    return this.board;
  }

  async getTasksIdByStatus(status: ColumnStatus): Promise<string[]> {
    await delay(0);
    const column = this.board.columns.find((column) => column.status === status);
    if (!column) throw new Error(`Column with status ${status} not found`);

    return column.taskIds;
  }

  async getTasks(boardId: string): Promise<Task[]> {
    await delay(0);
    if (this.board.id !== boardId) throw new Error('Board not found');

    const byId = new Map(this.tasks.map((task) => [task.id, task]));

    return this.board.columns.flatMap((col) =>
      col.taskIds
        .map((id) => byId.get(id))
        .filter((task): task is Task => task !== undefined)
        .map((task) => ({ ...task }))
    );
  }

  async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    const index = this.tasks.findIndex((task) => id === task.id);
    if (index === -1) throw new Error('Not found');
    this.tasks[index] = { ...this.tasks[index], ...data };

    await delay(0);
    return this.tasks[index];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserBoards(_userId: string): Promise<Board[]> {
    await delay(0);

    return [this.board];
  }

  async updateColumnOrder(updates: ColumnUpdate[]): Promise<void> {
    await delay(0);

    for (const { status, taskIds } of updates) {
      if (!this.board.columns.some((c) => c.status === status))
        throw new Error(`Column with status "${status}" not found`);
      for (const id of taskIds)
        if (!this.tasks.some((t) => t.id === id)) throw new Error(`Task with id "${id}" not found`);
    }

    for (const { status, taskIds } of updates) {
      this.board.columns.find((c) => c.status === status)!.taskIds = taskIds;
      taskIds.forEach((id) => {
        this.tasks.find((t) => t.id === id)!.status = status;
      });
    }
  }
}
