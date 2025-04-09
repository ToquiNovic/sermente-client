// @/pages/surveys/components/Steps/StepThree.tsx
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { SurveyFormData } from "@/models";
import { SubcategoryAccordion } from "../SubcategoryAccordion";

interface Props {
  setIsStepValid: (valid: boolean) => void;
  setTitle: (title: string) => void;
}

export const StepThree = ({ setIsStepValid, setTitle }: Props) => {
  const { watch } = useFormContext<SurveyFormData>();
  const values = watch();

  useEffect(() => {
    setTitle("Subcategorías");

    const hasAllSubcategories = values.categories.every((cat) => {
      const subs = values.subcategories?.[cat.id];
      return Array.isArray(subs) && subs.length > 0;
    });

    setIsStepValid(hasAllSubcategories);
  }, [values, setIsStepValid, setTitle]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Subcategorías por categoría</h3>
      <SubcategoryAccordion />
    </div>
  );
};
