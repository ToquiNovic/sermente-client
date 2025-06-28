// services/factor.service.ts
import axios from "axios";
import {
  Factor,
  createFactorProps,
  updateFactorProps,
  GetFactorsResponse,
} from "../types";
import { toast } from "sonner";

export const getFactors = async (): Promise<Factor[]> => {
  try {
    const response = await axios.get("/api/factor");

    toast.success("Factores cargados correctamente.");

    return response.data;
  } catch (error) {
    console.error("Error al obtener factores:", error);

    toast.error(
      "No se pudieron cargar los factores. Intenta de nuevo más tarde."
    );

    return [];
  }
};

export const createFactor = async (
  factor: createFactorProps
): Promise<Factor> => {
  try {
    const response = await axios.post("/api/factor", factor);

    toast.success("Factor creado exitosamente.");

    return response.data;
  } catch (error) {
    console.error("Error al crear factor:", error);

    toast.error("Error al crear factor. Intenta de nuevo más tarde.");

    throw error;
  }
};

export const updateFactor = async (
  factor: updateFactorProps
): Promise<Factor> => {
  try {
    const response = await axios.put(`/api/factor/${factor.id}`, factor);

    toast.success("Factor actualizado exitosamente.");

    return response.data;
  } catch (error) {
    console.error("Error al actualizar factor:", error);

    toast.error("Error al actualizar factor. Intenta de nuevo más tarde.");

    throw error;
  }
};

export const deleteFactor = async (id: string) => {
  try {
    const response = await axios.delete(`/api/factor/${id}`);

    toast.success("Factor eliminado exitosamente.");

    return response.data;
  } catch (error) {
    console.error("Error al eliminar factor:", error);

    toast.error("Error al eliminar factor. Intenta de nuevo más tarde.");

    throw error;
  }
};

export const getFactorsbySurveyId = async (
  surveyId: string,
  showSuccessToast = true
): Promise<GetFactorsResponse> => {
  try {
    const response = await axios.get(`/api/factor/survey/${surveyId}`);
    
    if (showSuccessToast) {
      toast.success("Factores cargados correctamente.");
    }

    return response.data;
  } catch (error) {
    console.error("Error al obtener factores:", error);
    toast.error(
      "No se pudieron cargar los factores. Intenta de nuevo más tarde."
    );
    return { message: "Error", factors: [] };
  }
};
