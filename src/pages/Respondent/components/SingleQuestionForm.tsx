import { useState, useEffect, useCallback } from "react";
import type { QuestionsResponse } from "../type";
import { QuestionItem } from "./QuestionItem";
import { Button } from "@/components/ui/button";

interface SingleQuestionFormProps {
  data: QuestionsResponse;
  onAnswer: (answers: Record<string, string>) => void;
  onNext?: () => void;
}

export const SingleQuestionForm = ({
  data,
  onAnswer,
  onNext,
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

  const handleAnswer = useCallback(
    (questionId: string, value: string) => {
      setAnswers((prev) => {
        const newAnswers = { ...prev, [questionId]: value };
        onAnswer(newAnswers);
        return newAnswers;
      });
    },
    [onAnswer]
  );

  const handleNext = useCallback(() => {
    const currentQuestion = questions[currentIndex];
    if (!answers[currentQuestion.id]) return;

    console.log("answers:", answers);    

    setCurrentIndex((prev) => {
      if (prev < questions.length - 1) {
        onNext?.();
        return prev + 1;
      } else {
        return prev;
      }
    });
  }, [questions, currentIndex, answers, onNext]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  // 👇 soporte para flechas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        const currentQuestion = questions[currentIndex];
        if (answers[currentQuestion.id]) {
          handleNext();
        }
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "Enter") {
        const currentQuestion = questions[currentIndex];
        if (answers[currentQuestion.id]) {
          handleNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, questions, currentIndex, answers]);

  const currentQuestion = questions[currentIndex];
  const isAnswered = !!answers[currentQuestion.id];

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

        <Button size="lg" onClick={handleNext} disabled={!isAnswered}>
          {currentIndex === questions.length - 1 ? "Finalizar" : "Siguiente"}
        </Button>
      </div>

      <p className="text-sm text-gray-500 text-center">
        Pregunta {currentIndex + 1} de {questions.length}
      </p>
    </div>
  );
};
