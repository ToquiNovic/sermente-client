import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import clsx from "clsx";
import { Ban, AlertCircle, Minus, CheckCircle2, Star } from "lucide-react";

interface FrequencyOptionsProps {
  value?: string;
  onChange: (value: string) => void;
}

const frequencyOptions = [
  { id: "never", label: "Nunca", icon: Ban },
  { id: "almost_never", label: "Casi nunca", icon: AlertCircle },
  { id: "sometimes", label: "Algunas veces", icon: Minus },
  { id: "almost_always", label: "Casi siempre", icon: CheckCircle2 },
  { id: "always", label: "Siempre", icon: Star },
];

export function FrequencyOptions({ value, onChange }: FrequencyOptionsProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className="grid grid-cols-2 md:grid-cols-5 gap-4"
    >
      {frequencyOptions.map((opt) => {
        const Icon = opt.icon;
        return (
          <label
            key={opt.id}
            htmlFor={opt.id}
            className={clsx(
              "flex flex-col items-center justify-center gap-2 p-6 rounded-xl border cursor-pointer transition-all",
              "hover:bg-gray-50",
              value === opt.id
                ? "border-blue-500 bg-blue-50 shadow-sm"
                : "border-gray-200"
            )}
          >
            <RadioGroupItem id={opt.id} value={opt.id} className="sr-only" />
            <Icon
              className={clsx(
                "w-8 h-8",
                value === opt.id ? "text-blue-600" : "text-gray-400"
              )}
            />
            <span
              className={clsx(
                "font-medium",
                value === opt.id ? "text-blue-600" : "text-gray-700"
              )}
            >
              {opt.label}
            </span>
          </label>
        );
      })}
    </RadioGroup>
  );
}
