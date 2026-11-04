import { useTask } from '../hooks/useTask';
import { UpdateTaskForm } from './UpdateTaskForm';
import { Button } from '@/components/ui';

interface UpdateTaskModalContentProps {
  boardId: string;
  taskId: string;
  onClose: () => void;
}
export const UpdateTaskModalContent = ({
  boardId,
  taskId,
  onClose,
}: UpdateTaskModalContentProps) => {
  const { data: task, isPending, isError } = useTask(boardId, taskId);

  if (isPending) return <p>Loading task...</p>;
  if (isError) return <p>Failed to load the task.</p>;

  if (!task) {
    return (
      <div className="space-y-4">
        <p>Task not found.</p>
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    );
  }

  return <UpdateTaskForm key={task.id} task={task} onClose={onClose} />;
};
