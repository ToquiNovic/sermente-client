import { useState } from "react";
import type { QuestionsResponse, Question } from "../type";
import { QuestionItem } from "./QuestionItem";
import { Button } from "@/components/ui/button";

interface SingleQuestionFormProps {
  data: QuestionsResponse;
  onAnswer: () => void;
}

export const SingleQuestionForm = ({
  data,
  onAnswer,
}: SingleQuestionFormProps) => {
  // Aplanamos todas las preguntas en un solo array
  const questions: Question[] = data.questions.flatMap((f) =>
    f.domains.flatMap((d) =>
      d.dimensions.flatMap((dim) =>
        dim.questions.sort((a, b) => a.position - b.position)
      )
    )
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-6">
      <QuestionItem question={questions[currentIndex]} onAnswer={onAnswer} />

      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          Anterior
        </Button>

        <Button
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
        >
          Siguiente
        </Button>
      </div>

      <p className="text-sm text-gray-500 text-center">
        Pregunta {currentIndex + 1} de {questions.length}
      </p>
    </div>
  );
};
