import { Controller, SubmitHandler, UseFormReturn } from 'react-hook-form';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui';

import { LABEL_OPTIONS, PRIORITY_OPTIONS, STATUS_OPTIONS } from '../constants';

import { CustomTextField } from '@/components/CustomTextField';
import { DatePicker } from '@/components/DatePicker';
import { CustomSelect } from '@/components/CustomSelect';
import { TaskFormData } from '../schemas';

interface TaskFormProps {
  id: string;
  form: UseFormReturn<TaskFormData>;
  onClose: () => void;
  onSubmit: SubmitHandler<TaskFormData>;
  submitLabel: string;
}

export const TaskForm = ({ id, form, onClose, onSubmit, submitLabel }: TaskFormProps) => {
  return (
    <form id={id} className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
        <Button type="submit">{submitLabel || 'Save'}</Button>
      </Field>
    </form>
  );
};
