// src/pages/Surveys/models/question.models.ts
export interface Question {
  id: string;
  text: string;
  position: number;
  isMultipleChoice?: boolean;
  options?: Option[];
}

export interface Option {
  id?: string;
  text: string;
  weight: number;
}