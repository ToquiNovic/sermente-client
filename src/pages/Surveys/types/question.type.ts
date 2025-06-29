export interface Question {
  id: string;
  text: string;
  position: number;
  isMultipleChoice: boolean;
  options?: Option[];
}

export interface Option {
  id?: string;
  text: string;
  weight: number;
}

export interface FactorForQuestion {
  id?: string;
  name: string;
  position: number;
  domains: DomainForQuestion[];
}

export interface DomainForQuestion {
  id: string;
  name: string;
  dimensions: DimensionForQuestion[];
}

export interface QuestionForFactor {
  id: string;
  text: string;
  position: number;
  dimensionId: string;
  options?: Option[];
}

export interface DimensionForQuestion {
  id: string;
  name: string;
  questions: QuestionForFactor[];
}
