import type { Question } from "../type";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { QuestionOptions } from "./QuestionOptions";

interface QuestionItemProps {
  question: Question;
  onAnswer: () => void;
}

export function QuestionItem({ question, onAnswer }: QuestionItemProps) {
  const [answered, setAnswered] = useState(false);

  const handleAnswer = () => {
    if (!answered) {
      setAnswered(true);
      onAnswer();
    }
  };

  // normalizamos para que siempre sea array
  const options = question.options ?? [];

  const isOpenQuestion =
    options.length === 0 ||
    (options.length === 1 &&
      options[0].text.toLowerCase() === "pregunta abierta");

  if (isOpenQuestion) {
    return (
      <div className="space-y-2">
        <Label>{question.text}</Label>
        <Input placeholder="Escriba su respuesta..." onBlur={handleAnswer} />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>{question.text}</Label>
      <QuestionOptions options={options} onAnswer={handleAnswer} />
    </div>
  );
}
