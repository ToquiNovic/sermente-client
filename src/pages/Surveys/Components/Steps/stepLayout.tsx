// @/pages/surveys/components/stepLayout.tsx
import { ReactNode } from "react";
import { MultiStepProgress } from "../MultiStepProgress";
import { Separator } from "@/components/ui/separator";

interface StepLayoutProps {
  title: string;
  steps: string[];
  currentStep: number;
  children: ReactNode;
}

export const StepLayout = ({
  steps,
  currentStep,
  children,
}: StepLayoutProps) => {
  return (
    <div className="space-y-10">
      <Separator />
      <MultiStepProgress steps={steps} currentStep={currentStep} />
      <div className="border p-6 rounded-lg shadow-sm bg-white">{children}</div>
    </div>
  );
};

