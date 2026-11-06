import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
// import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface CustomTextFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
}

export const CustomTextField = <T extends FieldValues>({
  control,
  label,
  name,
  placeholder,
}: CustomTextFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <Textarea
            {...field}
            id={field.name}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            rows={2}
            className="h-20 resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-foreground"
          />

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

// return (
//   <div>
//     <Label className="text-gray-700 pb-2">{label}</Label>
//     <Input className="py-6" placeholder={placeholder} />
//     {error && <span className="text-red-400 p-1">{error.message}</span>}
//   </div>
// );
