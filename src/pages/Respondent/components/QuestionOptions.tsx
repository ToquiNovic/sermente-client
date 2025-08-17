// src/components/questions/QuestionOptions.tsx
import type { Option } from "../type";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import clsx from "clsx";

interface QuestionOptionsProps {
  options: Option[];
  onAnswer: () => void;
}

export function QuestionOptions({ options, onAnswer }: QuestionOptionsProps) {
  return (
    <RadioGroup onValueChange={onAnswer} className="flex flex-wrap justify-center gap-4">
      {options.map((opt: Option) => (
        <label
          key={opt.id}
          className={clsx(
            "flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all",
            "hover:shadow-lg",
            "data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-50"
          )}
        >
          <RadioGroupItem
            value={opt.id}
            id={opt.id}
            className="sr-only" // Oculta el input real
          />
          {opt.icon && <opt.icon className="w-12 h-12 mb-2 text-purple-600" />}
          <span className="text-center text-sm text-gray-700">{opt.text || "Opción"}</span>
        </label>
      ))}
    </RadioGroup>
  );
}
