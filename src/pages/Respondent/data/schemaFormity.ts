// src/pages/Respondent/data/schemaFormity.ts

interface Option {
  value: string;
  label: string;
}

interface FormityField {
  path: string;
  label: string;
  component: "text" | "select" | "radio" | "textarea";
  options?: Option[];
}

interface QuestionOption {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
}

interface Dimension {
  questions: Question[];
}

interface Domain {
  dimensions: Dimension[];
}

interface Factor {
  name: string;
  domains: Domain[];
}

interface QuestionsResponse {
  questions: Factor[];
}

// 🔧 Esta es la única función útil
export function generateFormitySchema(
  data: QuestionsResponse
): { label: string; fields: FormityField[] }[] {
  return data.questions.map((factor) => ({
    label: factor.name,
    fields: factor.domains.flatMap((domain) =>
      domain.dimensions.flatMap((dimension) =>
        dimension.questions.map((question) => {
          const hasOptions = question.options.length > 0;
          return {
            path: `q_${question.id}`,
            label: question.text,
            component: hasOptions ? "radio" : "text",
            ...(hasOptions && {
              options: question.options.map((opt) => ({
                value: opt.id,
                label: opt.text || "(Opción vacía)",
              })),
            }),
          };
        })
      )
    ),
  }));
}

