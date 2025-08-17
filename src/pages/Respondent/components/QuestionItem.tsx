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

  if (
    question.options.length === 0 ||
    (question.options.length === 1 &&
      question.options[0].text === "pregunta abierta")
  ) {
    // Pregunta abierta
    return (
      <div className="space-y-2">
        <Label>{question.text}</Label>
        <Input placeholder="Escriba su respuesta..." onBlur={handleAnswer} />
      </div>
    );
  }

  // Pregunta con opciones
  return (
    <div className="space-y-2">
      <Label>{question.text}</Label>
      <QuestionOptions options={question.options} onAnswer={handleAnswer} />
    </div>
  );
}
