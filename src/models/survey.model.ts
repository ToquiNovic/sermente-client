// models/survey.model.ts
export interface TypeSurvey {
  id: number;
  name: string;
  description: string;
  state: boolean;
  isPublic: boolean;
}

export interface Creator {
  id: string;
  numberDoc: string;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  deadline: string;
  createdAt: string;
  typeSurvey: TypeSurvey;
  creator: Creator;
}

export interface SurveyFormData {
  title: string;
  description: string;
  deadline: string;
  typeSurveyId: string;
}

export interface UpdateSurveyData {
  id: string;
  deadline: string;
}

export interface TypeSurvey {
  id: number;
  name: string;
  description: string;
  state: boolean;
  isPublic: boolean;
}

export interface TypeSurveyResponse {
  typeSurveys: TypeSurvey[];
}
