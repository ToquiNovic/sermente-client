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

export interface SurveyAssignment {
  survey: string;
  names: string;
  surNames: string;
  email?: string;
  phone?: string;
  dependency: string;
  positionCompany: string;
  numberDoc: string;
  contractType: string; 
  hierarchyOfEmployment: string;
}

export type SurveyAssignmentList = SurveyAssignment[];
