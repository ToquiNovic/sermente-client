// @/pages/surveys/components/Steps/StepThree.tsx
import { useFormContext } from "react-hook-form";
import { SurveyFormData } from "@/models";

export const StepThree = () => {
  const { getValues } = useFormContext<SurveyFormData>();
  const data = getValues();

  return (
    <div>
      <p>
        <strong>Título:</strong> {data.title}
      </p>
      <p>
        <strong>Descripción:</strong> {data.description}
      </p>
      <p>Revisa la información antes de enviar.</p>
    </div>
  );
};
