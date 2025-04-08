// @/pages/surveys/components/Steps/StepOne.tsx
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
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
  setIsStepValid: (valid: boolean) => void;
  setTitle: (title: string) => void;
}

export const StepOne = ({ setIsStepValid, setTitle }: StepOneProps) => {
  const {
    control,
    formState: { isValid },
    trigger,
    setValue,
    watch,
    getValues,
  } = useFormContext();

  const title = watch("title");

  useEffect(() => {
    trigger();
  }, [trigger]);

  useEffect(() => {
    setIsStepValid(isValid);
  }, [isValid, setIsStepValid]);

  useEffect(() => {
    const currentId = getValues("id");
    if (!currentId) {
      const newId = uuidv4();
      setValue("id", newId);
      console.log("🆔 UUID generado en StepOne:", newId);
    }
  }, [getValues, setValue]);

  useEffect(() => {
    setTitle(title || "");
  }, [title, setTitle]);

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
