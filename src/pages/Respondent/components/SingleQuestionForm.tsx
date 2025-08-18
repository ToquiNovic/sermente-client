import { useState, useEffect, useCallback } from "react";
import type { QuestionsResponse } from "../type";
import { QuestionItem } from "./QuestionItem";
import { Button } from "@/components/ui/button";

interface SingleQuestionFormProps {
  data: QuestionsResponse;
  onAnswer: (answers: Record<string, string>) => void;
}

export const SingleQuestionForm = ({
  data,
  onAnswer,
}: SingleQuestionFormProps) => {
  const questions = data.questions.flatMap((f) =>
    f.domains.flatMap((d) =>
      d.dimensions.flatMap((dim) =>
        dim.questions
          .filter((q) => q && q.text)
          .sort((a, b) => a.position - b.position)
          .map((q) => ({
            ...q,
            factorName: f.name,
            domainName: d.name,
            dimensionName: dim.name,
          }))
      )
    )
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev < questions.length - 1) {
        return prev + 1;
      } else {
        onAnswer(answers);
        return prev;
      }
    });
  }, [questions.length, onAnswer, answers]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  // 👇 soporte para flechas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "Enter") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  const currentQuestion = questions[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6">
      <QuestionItem
        question={currentQuestion}
        onAnswer={(value) => handleAnswer(currentQuestion.id, value)}
      />

      <div className="flex justify-between w-full max-w-3xl px-6">
        <Button
          variant="outline"
          size="lg"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          Anterior
        </Button>

        <Button size="lg" onClick={handleNext}>
          {currentIndex === questions.length - 1 ? "Finalizar" : "Siguiente"}
        </Button>
      </div>

      <p className="text-sm text-gray-500 text-center">
        Pregunta {currentIndex + 1} de {questions.length}
      </p>
    </div>
  );
};
