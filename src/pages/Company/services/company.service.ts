import axios from "axios";
import { CreateCompanyFormData, Company } from "@/models";

export const getCompanies = async (): Promise<Company[]> => {
  try {
    const response = await axios.get("/api/company");
    return response.data.companies;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error al obtener las empresas:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Error al obtener las empresas."
      );
    } else {
      console.error("Error desconocido al obtener las empresas:", error);
      throw new Error("Error desconocido al obtener las empresas.");
    }
  }
};

export const getCompany = async (companyId: string): Promise<Company> => {
  try {
    const response = await axios.get(`/api/company/${companyId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error al obtener la empresa:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Error al obtener la empresa."
      );
    } else {
      console.error("Error desconocido al obtener la empresa:", error);
      throw new Error("Error desconocido al obtener la empresa.");
    }
  }
};

export const createCompany = async (companyData: CreateCompanyFormData) => {
  try {
    const response = await axios.post("/api/company", companyData);
    return response.data.companies;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Error al crear la empresa (Axios):", errorMessage);
      throw new Error(errorMessage);
    } else {
      console.error("Error desconocido al crear la empresa:", error);
      throw new Error("Unknown error occurred while creating company.");
    }
  }
};

export const deleteCompany = async (companyId: string) => {
  try {
    const response = await axios.delete(`/api/company/${companyId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Error al eliminar la empresa."
      );
    }
    throw new Error("Error de conexión con el servidor.");
  }
};

// Actualizar los datos de la empresa
export const updateCompany = async (companyId: string, companyData: Partial<Company>): Promise<Company> => {
  try {
    const response = await axios.patch(`/api/company/${companyId}`, companyData);
    return response.data.company;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Error al actualizar la empresa (Axios):", errorMessage);
      throw new Error(errorMessage);
    } else {
      console.error("Error desconocido al actualizar la empresa:", error);
      throw new Error("Error desconocido al actualizar la empresa.");
    }
  }
};