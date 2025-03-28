// models/company.model.ts
export interface Company {
  id: string;
  specialistId: string;
  companyId: string;
  name: string;
  nitCompany: string;
  legalAgent: string;
  address?: string;
  phone?: string;
  email?: string;
  urlIcon?: string;
  numberOfEmployees: number;
}
export interface CreateCompanyFormData {
  id: string;
  nameCompany: string;
  nitCompany: string;
  legalAgent: string;
  address?: string;
  phone?: string;
  email?: string;
  urlLogo?: string;
  specialistId: string;
  numberOfEmployees: number;
  extensionFile?: string;
}
