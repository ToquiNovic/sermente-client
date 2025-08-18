import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import clsx from "clsx";
import type { Option } from "../type";
import { Ban, AlertCircle, Minus, CheckCircle2, Star } from "lucide-react";

interface CustomRadioGroupProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

const frequencyMap: Record<
  string,
  { icon: React.ComponentType<{ className?: string }> }
> = {
  Nunca: { icon: Ban },
  "Casi nunca": { icon: AlertCircle },
  "Algunas veces": { icon: Minus },
  "Casi siempre": { icon: CheckCircle2 },
  Siempre: { icon: Star },
};

const frequencySet = [
  "Nunca",
  "Casi nunca",
  "Algunas veces",
  "Casi siempre",
  "Siempre",
];

export function CustomRadioGroup({
  options,
  value,
  onChange,
}: CustomRadioGroupProps) {
  const isFrequency = options.every((opt) => frequencySet.includes(opt.text));

  const sortedOptions = isFrequency
    ? frequencySet
        .map((text) => options.find((opt) => opt.text === text))
        .filter((opt): opt is Option => opt !== undefined)
    : options;

  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className={clsx(
        isFrequency
          ? "grid grid-cols-2 md:grid-cols-5 gap-4"
          : "flex flex-wrap justify-center gap-4"
      )}
    >
      {sortedOptions.map((opt) => {
        const Icon = isFrequency ? frequencyMap[opt.text]?.icon : opt.icon;

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

            {Icon && (
              <Icon
                className={clsx(
                  "w-8 h-8",
                  value === opt.id ? "text-blue-600" : "text-gray-400"
                )}
              />
            )}

            <span
              className={clsx(
                "font-medium",
                value === opt.id ? "text-blue-600" : "text-gray-700"
              )}
            >
              {opt.text}
            </span>
          </label>
        );
      })}
    </RadioGroup>
  );
}
