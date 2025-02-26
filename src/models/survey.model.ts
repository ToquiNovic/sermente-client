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
