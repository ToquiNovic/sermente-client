// services/domains.service.ts
import axios from "axios";
import { toast } from "sonner";
import { CreateDomainProps, Domain, Factor, UpdateDomainProps } from "../types";

interface GetDomainsBySurveyIdResponse {
  message: string;
  factors: Factor[];
}

export const getDomainsbySurveyId = async (
  surveyId: string
): Promise<GetDomainsBySurveyIdResponse> => {
  try {
    const response = await axios.get(`/api/domain/survey/${surveyId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener dominios:", error);
    toast.error("No se pudieron cargar los dominios. Intenta nuevamente.");
    return { message: "Error", factors: [] };
  }
};

export const createDomain = async (
  domain: CreateDomainProps
): Promise<Domain | null> => {
  try {
    const response = await axios.post(`/api/domain`, domain);

    toast.success("Dominio creado correctamente.");
    return response.data;
  } catch (error) {
    console.error("Error al crear dominio:", error);
    toast.error("No se pudo crear el dominio.");
    return null;
  }
};

export const updateDomain = async (
  domain: UpdateDomainProps
): Promise<Domain | null> => {
  try {
    const response = await axios.put(`/api/domain/${domain.id}`, domain);

    toast.success("Dominio actualizado correctamente.");
    return response.data;
  } catch (error) {
    console.error("Error al actualizar dominio:", error);
    toast.error("No se pudo actualizar el dominio.");
    return null;
  }
};

export const deleteDomain = async (id: string) => {
  try {
    const response = await axios.delete(`/api/domain/${id}`);

    toast.success("Dominio eliminado correctamente.");
    return response.data;
  } catch (error) {
    console.error("Error al eliminar dominio:", error);
    toast.error("No se pudo eliminar el dominio.");
    return null;
  }
};
