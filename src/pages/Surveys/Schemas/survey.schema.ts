import { z } from "zod";
import { SurveyFormData } from "@/models";

export const surveySchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres."),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres."),
});

export type SurveyRequest = SurveyFormData & { createdBy: string };
