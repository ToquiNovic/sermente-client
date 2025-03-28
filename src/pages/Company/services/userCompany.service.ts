// services/userCompany.service.ts
import axios from "axios";
import { AssignUsersToCompanyProps } from "@/models";

export const assignUsersToCompany = async ( companyId: string, users: AssignUsersToCompanyProps) => {
  try {
    const response = await axios.post(`/api/company/${companyId}/assign`, users);
    return response.data;
  } catch (error) {
    console.error("Error al asignar usuarios a la empresa:", error);
    throw error;
  }
};