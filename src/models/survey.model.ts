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

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface SurveyFormData {
  id: string;
  title: string;
  description: string;
  categories: { id: string; name: string; description: string }[];
  subcategories?: {
    [categoryId: string]: Subcategory[];
  };
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
