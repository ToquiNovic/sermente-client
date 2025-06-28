import { Domain } from "./domains.type";

export interface Factor {
  id?: string;
  name: string;
  description: string;
  position: number;
  domains?: Domain[];
}

export interface createFactorProps {
  name: string;
  description: string;
  position: number;
  surveyId: string;
}

export interface updateFactorProps {
  id: string;
  name: string;
  description: string;
  position: number;
}

export interface GetFactorsResponse {
  message: string;
  factors: Factor[];
}

export interface FactorFrom {
  factors: Factor[];
}