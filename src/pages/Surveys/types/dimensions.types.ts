export interface Dimension {
  id?: string;
  name: string;
  domainId?: string;
}

export interface DomainforDimension {
  id: string;
  name: string;
  dimensions: Dimension[];
}

export interface FactorforDimension {
  id: string;
  name: string;
  position: number;
  domains: DomainforDimension[];
}

export interface GetDimensionBySurveyId {
  message: string;
  factors: FactorforDimension[];
}


export interface CreateDimensionProps {
  name: string;
  domainId: string;
}

export interface UpdateDimensionProps {
  id: string;
  name: string;
  domainId: string;
}