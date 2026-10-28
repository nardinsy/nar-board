import clsx from 'clsx';

import { useTasks } from '../hooks/useTasks';
import { BoardColumns } from './BoardColumns';
import { ColumnStatus } from '../types';
import { useMemo } from 'react';
import { Button } from '@/components/ui';

export const BoardContent = ({ boardId }: { boardId: string }) => {
  const { data: tasks, error, isLoading } = useTasks(boardId);

  const boardData = useMemo(() => {
    const statuses: { id: ColumnStatus; status: ColumnStatus }[] = [
      { id: 'todo', status: 'todo' },
      { id: 'in-progress', status: 'in-progress' },
      { id: 'in-review', status: 'in-review' },
      { id: 'done', status: 'done' },
    ];

    return statuses.map((col) => ({
      ...col,
      tasks: tasks?.filter((task) => task.status === col.status) ?? [],
    }));
  }, [tasks]);

  return (
    <div className="relative bg-background">
      {/* // TODO make this component */}
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-xs">
          <div className="w-1/4 text-center bg-card border border-red-200 rounded-xl px-6 py-16 shadow-2xl">
            <p className="text-destructive text-lg mb-2">Failed to load tasks</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.location.reload()}
              className="text-lg text-blue-600"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      <section
        className={clsx(
          'overflow-x-scroll lg:overflow-x-hidden overflow-y-hidden flex flex-row gap-2 px-2 md:justify-center py-1',
          error && 'pointer-events-none'
        )}
      >
        <BoardColumns columnsData={boardData} boardId={boardId} isLoading={isLoading} />
      </section>
    </div>
  );
};
