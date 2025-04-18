// @/pages/surveys/schemas/survey.schema.ts
import { z } from "zod";
import { SurveyFormData } from "@/models";

export const surveySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3, "El título debe tener al menos 3 caracteres."),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres."),
  categories: z
    .array(
      z.object({
        name: z.string().min(1, "El nombre es obligatorio."),
        description: z.string().optional(),
      })
    )
    .optional(),
});

export type SurveyRequest = SurveyFormData & { createdBy: string };
