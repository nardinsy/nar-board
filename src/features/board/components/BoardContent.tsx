import clsx from "clsx";

import { useTasks } from "../hooks/useTasks";
import { BoardColumns } from "./BoardColumns";
import { ColumnStatus } from "../types";
import { useMemo, useRef } from "react";

export const BoardContent = ({ boardId }: { boardId: string }) => {
  const { data: tasks, error, isLoading, dataUpdatedAt } = useTasks(boardId);

  const scrollPositions = useRef<Record<string, number>>({});
  const saveScrollPosition = (columnId: string, scrollTop: number) => {
    scrollPositions.current[columnId] = scrollTop;
  };

  const boardData = useMemo(() => {
    const statuses: { id: ColumnStatus; status: ColumnStatus }[] = [
      { id: "todo", status: "todo" },
      { id: "in-progress", status: "in-progress" },
      { id: "in-review", status: "in-review" },
      { id: "done", status: "done" },
    ];

    return statuses.map((col) => ({
      ...col,
      tasks: tasks?.filter((task) => task.status === col.status) ?? [],
    }));
  }, [tasks]);

  return (
    <div className="relative">
      {/* // TODO make this component */}
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-xs">
          <div className="w-1/4 text-center bg-white border border-red-200 rounded-xl px-6 py-16 shadow-2xl">
            <p className="text-red-600 text-lg mb-2">Failed to load tasks</p>
            <button
              onClick={() => window.location.reload()}
              className="text-lg text-blue-600 cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      <section
        className={clsx(
          "overflow-x-scroll lg:overflow-x-hidden overflow-y-hidden flex flex-row gap-2 px-2 md:justify-center py-1",
          error && "pointer-events-none",
        )}
      >
        <BoardColumns
          key={dataUpdatedAt}
          columnsData={boardData}
          boardId={boardId}
          isLoading={isLoading}
          scrollPositions={scrollPositions}
          onScroll={saveScrollPosition}
        />
      </section>
    </div>
  );
};

// TODO fix this mess
// const todoTasks = tasks?.filter((task) => task.status === 'todo');
// const inProgressTasks = tasks?.filter((task) => task.status === 'in-progress');
// const inReviewTasks = tasks?.filter((task) => task.status === 'in-review');
// const doneTasks = tasks?.filter((task) => task.status === 'done');

// const boardData: { id: UniqueIdentifier; status: ColumnStatus; tasks: Task[] }[] = [
//   {
//     id: 'todo',
//     status: 'todo',
//     tasks: todoTasks ?? [],
//   },
//   {
//     id: 'in-progress',
//     status: 'in-progress',
//     tasks: inProgressTasks ?? [],
//   },
//   {
//     id: 'in-review',
//     status: 'in-review',
//     tasks: inReviewTasks ?? [],
//   },
//   {
//     id: 'done',
//     status: 'done',
//     tasks: doneTasks ?? [],
//   },
// ];
