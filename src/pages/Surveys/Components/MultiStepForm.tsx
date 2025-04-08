// @/pages/surveys/components/MultiStepForm.tsx
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { surveySchema } from "../Schemas";
import { SurveyFormData } from "@/models";
import { StepLayout } from "./Steps/stepLayout";
import { stepsList } from "../utils/stepsList";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createSurvey } from "../services";

interface MultiStepFormProps {
  step: number;
  setStep: (step: number) => void;
}

export const MultiStepForm = ({ step, setStep }: MultiStepFormProps) => {
  const methods = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    defaultValues: { title: "", description: "", categories: [] },
    mode: "onChange",
  });

  const [isStepValid, setIsStepValid] = useState(false);
  const [formTitle, setFormTitle] = useState("");

  const currentStepMeta = stepsList[step] || {
    title: "Paso desconocido",
    component: () => <p>Paso no encontrado</p>,
    buttons: [],
  };

  const StepComponent = currentStepMeta.component;

  const onNext = () => {
    const values = methods.getValues();
    console.log("🟡 Datos actuales del formulario:", values);

    if (step === 1) {
      console.log("📦 Categorías actuales:", values.categories);
    }

    if (step < stepsList.length - 1) {
      setStep(step + 1);
    }
  };

  const onBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const onSubmit = async () => {
    const valid = await methods.trigger();
    if (!valid) return;

    const data = methods.getValues();

    try {
      const res = await createSurvey(data);

      console.log("res", res);

      // 🔥 Establece el ID en el formulario
      methods.setValue("id", res.id);
      console.log("🆔 Encuesta creada con ID:", res.id);

      // ⚠️ Opcional: también lo puedes imprimir aquí
      const updated = methods.getValues();
      console.log("📦 Datos después del setValue:", updated);

      toast.success("Encuesta creada exitosamente");
      setStep(1); // ⬅️ No redirijas aún, continúa al paso 2
    } catch {
      toast.error("Ocurrió un error al crear la encuesta");
    }
  };

  return (
    <FormProvider {...methods}>
      <form className="space-y-6">
        <StepLayout
          title={formTitle || currentStepMeta.title}
          steps={stepsList.map((s) => s.title)}
          currentStep={step}
        >
          <StepComponent
            setTitle={setFormTitle}
            setIsStepValid={setIsStepValid}
            onNext={onNext}
            onBack={onBack}
            onSubmit={onSubmit}
          />

          <div className="flex justify-between pt-6">
            {currentStepMeta.buttons?.includes("back") && (
              <Button type="button" variant="outline" onClick={onBack}>
                Atrás
              </Button>
            )}
            {currentStepMeta.buttons?.includes("next") && (
              <Button type="button" onClick={onNext} disabled={!isStepValid}>
                Siguiente
              </Button>
            )}
            {currentStepMeta.buttons?.includes("submit") && (
              <Button type="button" onClick={onSubmit} disabled={!isStepValid}>
                Guardar encuesta
              </Button>
            )}
          </div>
        </StepLayout>
      </form>
    </FormProvider>
  );
};
