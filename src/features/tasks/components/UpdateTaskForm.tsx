import { SubmitHandler } from 'react-hook-form';

import { useUpdateTask } from '../hooks/useUpdateTask';
import { useTaskForm } from '../hooks/useTaskForm';

import { TaskForm } from './TaskForm';
import { TaskFormData } from '../schemas';
import { Task } from '../types';
import { useState } from 'react';
import { useDeleteTask } from '../hooks/useDeleteTask';
import { Button } from '@/components/ui';

interface UpdateTaskFormProps {
  task: Task;
  onClose: () => void;
}

export const UpdateTaskForm = ({ task, onClose }: UpdateTaskFormProps) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const form = useTaskForm({
    title: task.title,
    description: task.description ?? '',
    label: task.label,
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate ?? '',
  });
  const { mutate: deleteTask } = useDeleteTask(task.boardId);
  const { mutate: updateTask } = useUpdateTask(task.boardId);

  const onSubmit: SubmitHandler<TaskFormData> = (values) => {
    updateTask({ taskId: task.id, data: values });
    onClose();
  };

  if (confirmingDelete) {
    return (
      <div className="space-y-4">
        <p>
          Delete <strong>{task.title}</strong>? This can't be undone.
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => setConfirmingDelete(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              deleteTask(task.id);
              onClose();
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    );
  }

  return (
    <TaskForm
      id={'form-rhf-update'}
      form={form}
      onClose={onClose}
      onSubmit={onSubmit}
      submitLabel="Save changes"
      extraAction={{
        label: 'Delete task',
        variant: 'destructive',
        onClick: () => setConfirmingDelete(true),
      }}
    />
  );
};
