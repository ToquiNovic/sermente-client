// models/survey.model.ts
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
