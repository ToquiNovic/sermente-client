import { Progress } from "@/components/ui/progress";

interface SurveyProgressProps {
  current: number;
  total: number;
}

export const SurveyProgress = ({ current, total }: SurveyProgressProps) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex justify-center mb-1 text-sm font-medium">
        <span>
          {current} / {total}
        </span>
      </div>
      <Progress value={percentage} className="h-4" />
    </div>
  );
};
