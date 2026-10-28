import clsx from 'clsx';

import { BoardColumns } from './BoardColumns';
import { groupByStatus, useBoardColumns } from '../hooks/useBoardColumns';
import { BoardError } from './BoardError';

const EMPTY_COLUMNS = groupByStatus([]);

export const BoardContent = ({ boardId }: { boardId: string }) => {
  const { data, isError, isLoading, refetch } = useBoardColumns(boardId);

  const columns = data ?? EMPTY_COLUMNS;
  const showError = isError && !data;

  return (
    <div className="relative bg-background">
      {showError && <BoardError onRetry={refetch} />}

      <section
        className={clsx(
          'overflow-x-scroll lg:overflow-x-hidden overflow-y-hidden flex flex-row gap-2 px-2 md:justify-center py-1',
          showError && 'pointer-events-none'
        )}
      >
        <BoardColumns columnsData={columns} boardId={boardId} isLoading={isLoading} />
      </section>
    </div>
  );
};
