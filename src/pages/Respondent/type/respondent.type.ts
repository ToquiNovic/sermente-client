// types.ts
export interface QuestionsResponse {
  message: string;
  questions: Factor[];
}

export interface Option {
  id: string;
  text: string;
  weight: number;
}

export interface Question {
  id: string;
  text: string;
  position: number;
  dimensionId: string;
  options: Option[];
}

export interface Dimension {
  id: string;
  name: string;
  questions: Question[];
}

export interface Domain {
  id: string;
  name: string;
  dimensions: Dimension[];
}

export interface Factor {
  id: string;
  name: string;
  position: number;
  domains: Domain[];
}

export interface QuestionsResponse {
  message: string;
  questions: Factor[];
}


export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  factors: Factor[];
  domains: Domain[];
}