// @/pages/surveys/components/Steps/StepOne.tsx
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface StepOneProps {
  setIsStepValid: (isValid: boolean) => void;
}

export const StepOne = ({ setIsStepValid }: StepOneProps) => {
  const { control, formState } = useFormContext();
  const { isValid } = formState;

  useEffect(() => {
    setIsStepValid(isValid);
  }, [isValid, setIsStepValid]);

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ej: Encuesta de satisfacción" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Ej: Evaluación de la calidad del servicio..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
