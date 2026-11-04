import { Controller, SubmitHandler } from 'react-hook-form';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { CustomTextField } from '@/components/CustomTextField';
import { CustomSelect } from '@/components/CustomSelect';
import { DatePicker } from '@/components/DatePicker';
import { Button } from '@/components/ui';

import { useUpdateTask } from '../hooks/useUpdateTask';
import { useUpdateTaskForm } from '../hooks/useUpdateTaskForm';

import { UpdateTaskFormData } from '../schemas';
import { LABEL_OPTIONS, PRIORITY_OPTIONS, STATUS_OPTIONS } from '../constants';
import { Task } from '../types';

interface UpdateTaskFormProps {
  task: Task;
  onClose: () => void;
}

export const UpdateTaskForm = ({ task, onClose }: UpdateTaskFormProps) => {
  const form = useUpdateTaskForm(task);
  const { mutate } = useUpdateTask(task.boardId);

  const onSubmit: SubmitHandler<UpdateTaskFormData> = (values) => {
    mutate({ taskId: task.id, data: values });
    onClose();
  };

  return (
    <form id="form-rhf-update" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <CustomTextField
          control={form.control}
          name="title"
          label="Task Title"
          placeholder="Enter title"
        />
        <CustomTextField
          control={form.control}
          name="description"
          label="Task Description"
          placeholder="Enter description"
        />

        <Controller
          name="dueDate"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Due Date</FieldLabel>
              <DatePicker field={field} className="w-full" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <CustomSelect
          control={form.control}
          name="label"
          label="Label"
          placeholder="Select Label"
          items={LABEL_OPTIONS}
        />

        <CustomSelect
          control={form.control}
          name="priority"
          label="Priority"
          placeholder="Select Priority"
          items={PRIORITY_OPTIONS}
        />

        <CustomSelect
          control={form.control}
          name="status"
          label="Status"
          placeholder="Select Status"
          items={STATUS_OPTIONS}
        />
      </FieldGroup>

      {/* //TODO button style */}
      <Field orientation="horizontal">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" form="form-rhf-update">
          Save Changes
        </Button>
      </Field>
    </form>
  );
};
