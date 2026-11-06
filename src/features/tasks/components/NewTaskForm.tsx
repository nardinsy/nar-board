import { SubmitHandler } from 'react-hook-form';

import { useTaskForm } from '../hooks/useTaskForm';
import { useCreateTask } from '../hooks/useCreateTask';

import { TaskForm } from './TaskForm';
import { ColumnStatus } from '@/features/board/types';
import { TaskFormData } from '../schemas';

interface NewTaskFormProps {
  boardId: string;
  status: ColumnStatus;
  onClose: () => void;
}

export const NewTaskForm = ({ boardId, status, onClose }: NewTaskFormProps) => {
  const form = useTaskForm({
    title: '',
    description: '',
    label: 'feature',
    priority: 'low',
    status,
    dueDate: '',
  });
  const { mutate } = useCreateTask();

  const onSubmit: SubmitHandler<TaskFormData> = (values) => {
    mutate(
      { ...values, boardId },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <TaskForm
      id={'form-rhf'}
      form={form}
      onClose={onClose}
      onSubmit={onSubmit}
      submitLabel="Create task"
    />
  );
};
