// @/pages/surveys/components/MultiStepForm.tsx
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { surveySchema } from "../Schemas";
import { SurveyFormData } from "@/models";
import { StepLayout } from "./Steps/stepLayout";
import { Button } from "@/components/ui/button";
import { stepsList } from "../utils/stepsList";
import { useState, useEffect } from "react";
import { CardFooter } from "@/components/ui/card";

interface MultiStepFormProps {
  step: number;
  setStep: (step: number) => void;
  onSubmit: (data: SurveyFormData) => void;
}

export const MultiStepForm = ({
  step,
  setStep,
  onSubmit,
}: MultiStepFormProps) => {
  const methods = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    defaultValues: { title: "", description: "" },
    mode: "onChange",
  });

  const [dynamicTitle, setDynamicTitle] = useState("");
  const [isStepValid, setIsStepValid] = useState(false);

  const { title, component: StepComponent } = stepsList[step] || {
    title: "Paso Desconocido",
    component: () => <p>Paso no encontrado</p>,
  };

  useEffect(() => {
    methods.trigger();
  }, [step, methods]);

  const handleNextStep = () => {
    if (isStepValid) setStep(step + 1); // Solo avanza si el paso es válido
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <StepLayout
          title={dynamicTitle || title}
          steps={stepsList.map((s) => s.title)}
          currentStep={step}
        >
          <StepComponent
            setTitle={setDynamicTitle}
            setIsStepValid={setIsStepValid}
          />
        </StepLayout>

        <CardFooter className="flex justify-between">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Anterior
            </Button>
          )}
          {step < stepsList.length - 1 ? (
            <Button
              type="button"
              onClick={handleNextStep}
              disabled={!isStepValid}
            >
              Siguiente
            </Button>
          ) : (
            <Button type="submit" disabled={!isStepValid}>
              Enviar
            </Button>
          )}
        </CardFooter>
      </form>
    </FormProvider>
  );
};
