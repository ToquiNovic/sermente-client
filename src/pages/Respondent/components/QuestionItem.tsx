import type { QuestionsResponse, Question, Option } from "../type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// ---- Renderizador de una pregunta ----
export function QuestionItem({ question }: { question: Question }) {
  if (question.options.length === 0) {
    // Pregunta abierta (input)
    return (
      <div className="space-y-2">
        <Label>{question.text}</Label>
        <Input placeholder="Escriba su respuesta..." />
      </div>
    );
  }

  if (
    question.options.length === 1 &&
    question.options[0].text === "pregunta abierta"
  ) {
    // Otra forma de "pregunta abierta"
    return (
      <div className="space-y-2">
        <Label>{question.text}</Label>
        <Input placeholder="Escriba su respuesta..." />
      </div>
    );
  }

  // Pregunta con opciones (radio buttons)
  return (
    <div className="space-y-2">
      <Label>{question.text}</Label>
      <RadioGroup>
        {question.options.map((opt: Option) => (
          <div key={opt.id} className="flex items-center space-x-2">
            <RadioGroupItem value={opt.id} id={opt.id} />
            <Label htmlFor={opt.id}>{opt.text || "Opción"}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

// ---- Renderizador de todo el árbol ----
export function QuestionsForm({ data }: { data: QuestionsResponse }) {
  return (
    <div className="space-y-6">
      {data.questions.map((factor) => (
        <Card key={factor.id}>
          <CardHeader>
            <CardTitle>
              {factor.position}. {factor.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {factor.domains.map((domain) => (
              <div key={domain.id} className="ml-4 space-y-4">
                <h3 className="font-semibold">{domain.name}</h3>
                {domain.dimensions.map((dimension) => (
                  <div key={dimension.id} className="ml-4 space-y-3">
                    <h4 className="italic">{dimension.name}</h4>
                    {dimension.questions
                      .sort((a, b) => a.position - b.position)
                      .map((q) => (
                        <QuestionItem key={q.id} question={q} />
                      ))}
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
