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
