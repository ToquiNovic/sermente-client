// models/survey.model.ts
export interface Creator {
  id: string;
  numberDoc: string;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  deadline?: string;
  createdAt?: string;
  creator?: Creator;
}

export interface FactorforSurvey {
  id: string;
  name: string;
  description: string;
  position: number;
  domains?: DomainforFactor[];
}

export interface DomainforFactor {
  id: string;
  name: string;
  description: string;
  factorId?: string;
}

export interface DimensionforDomain {
  id: string;
  name: string;
  domainId?: string;
}

export interface SurveyFormData {
  id: string;
  title: string;
  description: string;
  factors: FactorforSurvey[];
  dimensions: DimensionforDomain[];
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
