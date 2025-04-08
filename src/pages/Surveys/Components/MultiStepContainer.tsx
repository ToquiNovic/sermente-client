// @/pages/surveys/components/MultiStepContainer.tsx
import { useState } from "react";
import { MultiStepForm } from "./MultiStepForm";

export const MultiStepContainer = () => {
  const [step, setStep] = useState(0);
  return <MultiStepForm step={step} setStep={setStep} />;
};
