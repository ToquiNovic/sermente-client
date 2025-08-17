// services/userCompany.service.ts
import axios from "axios";
import { AxiosError } from "axios";
import { AssignUsersToCompanyProps, AssignUsersToSurveyProps } from "@/models";
import { toast } from "@/hooks";

export const assignUsersToCompany = async (
  companyId: string,
  users: AssignUsersToCompanyProps
) => {
  try {
    const response = await axios.post(
      `/api/company/${companyId}/assign`,
      users
    );
    return response.data;
  } catch (error) {
    console.error("Error al asignar usuarios a la empresa:", error);
    throw error;
  }
};

export const removeUserFromCompany = async (
  companyId: string,
  userId: string
) => {
  try {
    const response = await axios.delete(
      `/api/company/${companyId}/assign/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al eliminar usuario de la empresa:", error);
    throw error;
  }
};

export const assignUsersToSurvey = async (
  companyId: string,
  payload: AssignUsersToSurveyProps
) => {
  try {
    const response = await axios.post(
      `/api/surveyassignment/${companyId}`,
      payload
    );

    toast({
      title: "✅ Encuesta asignada",
      description: "Los usuarios han sido asignados correctamente.",
    });

    return response.data;
  } catch (error: unknown) {
    console.error("Error al asignar usuarios a la encuesta:", error);

    toast({
      variant: "destructive",
      title: "❌ Error",
      description:
        (error instanceof AxiosError && error.response?.data?.message) ||
        "No se pudo asignar la encuesta. Intenta de nuevo.",
    });

    throw error;
  }
};
