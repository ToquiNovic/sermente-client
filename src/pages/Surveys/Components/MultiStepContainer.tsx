// @/pages/surveys/components/MultiStepContainer.tsx
import { useState } from "react";
import { SurveyFormData } from "@/models";
import { MultiStepForm } from "./MultiStepForm";

export const MultiStepContainer = ({
  onSubmit,
}: {
  onSubmit: (data: SurveyFormData) => void;
}) => {
  const [step, setStep] = useState(0);

  return <MultiStepForm step={step} setStep={setStep} onSubmit={onSubmit} />;
};
