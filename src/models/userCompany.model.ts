// models/userCompany.model.ts

export interface AssignUserProps {
  email: string;
  names: string;
  surNames: string;
  numberDoc: string;
  contractType: string;
  hierarchyOfEmployment: string;
}

export interface AssignUsersToCompanyProps {
  companyId?: string;
  users: AssignUserProps[];
}

type Users = {
  id: string;
}

export interface AssignUsersToSurveyProps {
  companyId?: string;
  deadline: string;
  users: Users[];
}
