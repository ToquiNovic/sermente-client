// @/pages/surveys/components/Steps/StepThree.tsx
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { SurveyFormData } from "@/models";
import { DomainAccordionForm } from "../DomainAccordionForm";

interface Props {
  setIsStepValid: (valid: boolean) => void;
  setTitle: (title: string) => void;
}

export const StepThree = ({ setIsStepValid, setTitle }: Props) => {
  const { watch } = useFormContext<SurveyFormData>();
  const values = watch();

  useEffect(() => {
    setTitle("Dominios");

    const hasAllDomain = values.factors.every((factor) => {
      return factor.domains && factor.domains.length > 0;
    });

    setIsStepValid(hasAllDomain);
  }, [values, setIsStepValid, setTitle]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Dominios de Factores</h3>
      <DomainAccordionForm />
    </div>
  );
};
