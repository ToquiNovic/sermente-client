import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ReactDatePicker from "react-datepicker";
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";

interface FormDatePickerProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  labelHour?: string;
  control: Control<T>;
  readOnly?: boolean;
}

export const DatePicker = <T extends FieldValues>({
  name,
  label,
  labelHour,
  control,
  readOnly,
}: FormDatePickerProps<T>) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control });

  const { field: timeField, fieldState: timeError } = useController({
    name: "loadTime" as Path<T>,
    control,
  });

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-2 flex-1">
        <Label htmlFor="date-picker">{label}</Label>
        <ReactDatePicker
          selected={value ? new Date(value) : null} // ✅ react-hook-form controla el valor
          onChange={(date: Date | null) => {
            if (date) {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              onChange(`${year}-${month}-${day}`);
            } else {
              onChange("");
            }
          }}
          dateFormat="dd/MM/yyyy"
          placeholderText="Selecciona fecha"
          className="w-full p-2 border rounded-md font-normal"
          wrapperClassName="w-full"
          disabled={readOnly}
          id="date-picker"
          isClearable
        />
        {error && <p className="text-sm text-destructive">{error.message}</p>}
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <Label htmlFor="time-picker">{labelHour}</Label>
        <Input
          type="time"
          id="time-picker"
          step="60"
          min="00:00"
          max="23:59"
          className="cursor-pointer"
          {...timeField}
          disabled={readOnly}
        />
        {timeError?.error && (
          <p className="text-sm text-destructive">{timeError.error.message}</p>
        )}
      </div>
    </div>
  );
};
