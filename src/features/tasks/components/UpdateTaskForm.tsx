import { SubmitHandler } from 'react-hook-form';

import { useUpdateTask } from '../hooks/useUpdateTask';
import { useTaskForm } from '../hooks/useTaskForm';

import { TaskForm } from './TaskForm';
import { TaskFormData } from '../schemas';
import { Task } from '../types';

interface UpdateTaskFormProps {
  task: Task;
  onClose: () => void;
}

export const UpdateTaskForm = ({ task, onClose }: UpdateTaskFormProps) => {
  const form = useTaskForm({
    title: task.title,
    description: task.description,
    label: task.label,
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate,
  });
  const { mutate } = useUpdateTask(task.boardId);

  const onSubmit: SubmitHandler<TaskFormData> = (values) => {
    mutate({ taskId: task.id, data: values });
    onClose();
  };

  return (
    <TaskForm
      id={'form-rhf-update'}
      form={form}
      onClose={onClose}
      onSubmit={onSubmit}
      submitLabel="Save changes"
    />
  );
};
