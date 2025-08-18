import type { Question } from "../type";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useMemo, useCallback } from "react";
import { QuestionOptions } from "./QuestionOptions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type QuestionWithMeta = Question & {
  factorName: string;
  domainName: string;
  dimensionName: string;
};

interface QuestionItemProps {
  question: QuestionWithMeta;
  onAnswer: (value: string) => void;
}

export function QuestionItem({ question, onAnswer }: QuestionItemProps) {
  const [answered, setAnswered] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>("");

  // ✅ Memoizar opciones
  const options = useMemo(() => question.options ?? [], [question.options]);

  const isOpenQuestion =
    options.length === 0 ||
    (options.length === 1 &&
      options[0].text.toLowerCase() === "pregunta abierta");

  // ✅ Memoizar handleAnswer
  const handleAnswer = useCallback(
    (value: string) => {
      setSelectedValue(value);
      if (!answered) setAnswered(true);
      onAnswer(value);
    },
    [answered, onAnswer]
  );

  // 👇 Capturar número del teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= options.length) {
        const option = options[num - 1];
        if (option) {
          handleAnswer(option.id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options, handleAnswer]);

  return (
    <Card className="shadow-md rounded-xl bg-blue-50">
      <CardHeader className="text-center bg-blue-400">
        <CardTitle>{question.domainName}</CardTitle>
        <CardDescription>{question.dimensionName}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center gap-6 py-6">
        {/* Pregunta */}
        <Label className="font-extrabold text-4xl text-center">
          {question.text}
        </Label>

        {isOpenQuestion ? (
          <Input
            className="max-w-md text-center"
            placeholder="Escriba su respuesta..."
            onBlur={(e) => handleAnswer(e.target.value)}
          />
        ) : (
          <div className="w-full">
            <QuestionOptions
              options={options}
              value={selectedValue}
              onAnswer={handleAnswer}
            />
            <p className="text-sm text-gray-500 mt-2 text-center">
              (Puedes responder con el teclado: 1, 2, 3…)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
