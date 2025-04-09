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
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [isStepValid, setIsStepValid] = useState(false);
  const [formTitle, setFormTitle] = useState("");

  const currentStepMeta = stepsList[step] || {
    title: "Paso desconocido",
    component: () => <p>Paso no encontrado</p>,
    buttons: [],
  };

  const StepComponent = currentStepMeta.component;

  const onNext = () => {
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

    const raw = methods.getValues();

    try {
      const data = {
        id: raw.id,
        title: raw.title.trim(),
        description: raw.description.trim(),
        categories: raw.categories.map((cat) => ({
          id: cat.id,
          name: cat.name.trim(),
          description: cat.description?.trim() || "",
        })),
        subcategories: Object.fromEntries(
          Object.entries(raw.subcategories || {}).map(([catId, subs]) => [
            catId,
            subs.map((sub) => ({
              id: sub.id,
              name: sub.name.trim(),
              categoryId: sub.categoryId,
            })),
          ])
        ),
      };
      const res = await createSurvey(data);
      navigate(`/surveys/manage/${res.id}`);
      methods.setValue("id", res.id);
      toast.success("Encuesta creada exitosamente");
      setStep(1);
    } catch (error) {
      console.error("❌ Error al crear encuesta:", error);
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
