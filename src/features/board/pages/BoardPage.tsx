import { useParams, useSearchParams } from 'react-router-dom';

import NotFoundPage from '@/pages/NotFoundPage';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Modal } from '@/components/Modal';
import { NewTaskForm } from '@/features/tasks/components/NewTaskForm';
import { UpdateTaskModalContent } from '@/features/tasks/components/UpdateTaskModalContent';
import { BoardContent } from '../components/BoardContent';
import { BoardHeader } from '../components/BoardHeader';
import { useBoard } from '../hooks/useBoard';

import { ColumnStatus } from '../types';
import { COLUMN_STATUSES } from '../constants';

type ModalParam = 'createTask' | 'updateTask';
const isColumnStatus = (value: string): value is ColumnStatus => {
  return COLUMN_STATUSES.includes(value as ColumnStatus);
};

const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: board, isLoading, error } = useBoard(boardId ?? '');

  const createTaskParam = searchParams.get('createTask');
  const updateTaskId = searchParams.get('updateTask');

  const createTaskStatus =
    createTaskParam && isColumnStatus(createTaskParam) ? createTaskParam : null;

  const removeModalParam = (param: ModalParam) => {
    setSearchParams((params) => {
      params.delete(param);
      return params;
    });
  };

  if (isLoading) return <LoadingScreen />;
  if (error || !board || !boardId) return <NotFoundPage />;

  return (
    <>
      <BoardHeader board={board} />
      <BoardContent boardId={boardId} />
      {createTaskStatus && (
        <Modal onClose={() => removeModalParam('createTask')} title="Create a new task">
          <NewTaskForm
            boardId={boardId}
            status={createTaskStatus}
            onClose={() => removeModalParam('createTask')}
          />
        </Modal>
      )}

      {updateTaskId && (
        <Modal onClose={() => removeModalParam('updateTask')} title="Edit task">
          <UpdateTaskModalContent
            boardId={boardId}
            taskId={updateTaskId}
            onClose={() => removeModalParam('updateTask')}
          />
        </Modal>
      )}
    </>
  );
};

export default BoardPage;
