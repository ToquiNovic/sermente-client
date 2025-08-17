import type { Option } from "../type";
import { CustomRadioGroup } from "./CustomRadioGroup";

interface QuestionOptionsProps {
  options: Option[];
  value: string;
  onAnswer: (value: string) => void;
}

export function QuestionOptions({ options, value, onAnswer }: QuestionOptionsProps) {
  return (
    <CustomRadioGroup
      options={options}
      value={value}
      onChange={onAnswer}
    />
  );
}
