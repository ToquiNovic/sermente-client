// @/pages/surveys/components/MultiStepProgress.tsx
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface MultiStepProgressProps {
  currentStep: number;
  steps: string[];
}

export const MultiStepProgress = ({ currentStep, steps }: MultiStepProgressProps) => {
  return (
    <div className="flex flex-col items-center w-full space-y-6">
      <div className="flex items-center justify-center flex-wrap gap-x-8 gap-y-4 sm:gap-x-4"> 
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={index} className="flex items-center gap-x-4">
              <div className="flex flex-col items-center relative space-y-2">
                <Badge
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all",
                    isActive
                      ? "bg-primary text-white"
                      : isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                </Badge>
                <span
                  className={cn(
                    "text-sm font-medium text-center w-20 truncate sm:w-auto",
                    isActive ? "text-primary" : "text-gray-500"
                  )}
                >
                  {step}
                </span>
              </div>

              {index < steps.length - 1 && (
                <Separator
                  className={cn(
                    "w-16 h-1 sm:w-10 rounded-full transition-all",
                    isCompleted ? "bg-green-500" : "bg-gray-300"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

