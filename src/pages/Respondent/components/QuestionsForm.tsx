import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { QuestionsResponse } from "../type";
import { QuestionItem } from "./QuestionItem";

interface QuestionsFormProps {
  data: QuestionsResponse;
  onAnswer: () => void;
}

export const QuestionsForm = ({ data, onAnswer }: QuestionsFormProps) => {
  return (
    <div className="space-y-6">
      {data.questions
        .sort((a, b) => a.position - b.position)
        .map((factor) => (
          <Card key={factor.id}>
            <CardHeader>
              <CardTitle>
                {factor.position}. {factor.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {factor.domains.map((domain) => (
                <div key={domain.id} className="pl-4 border-l space-y-4">
                  <h3 className="font-semibold">{domain.name}</h3>
                  {domain.dimensions.map((dimension) => (
                    <div
                      key={dimension.id}
                      className="pl-4 border-l space-y-3"
                    >
                      <h4 className="italic">{dimension.name}</h4>
                      {dimension.questions
                        .sort((a, b) => a.position - b.position)
                        .map((q) => (
                          <QuestionItem
                            key={q.id}
                            question={q}
                            onAnswer={onAnswer}
                          />
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
};
