// services/dimensions.service.ts
import axios from "axios";
import { toast } from "sonner";
import {
  CreateDimensionProps,
  DomainforDimension,
  GetDimensionBySurveyId,
  UpdateDimensionProps,
} from "../types";

export const getDimensionsbySurveyId = async (
  surveyId: string
): Promise<GetDimensionBySurveyId> => {
  try {
    const response = await axios.get(`/api/dimension/survey/${surveyId}`);
    toast.success("Dimensiones cargados correctamente.");
    return response.data;
  } catch (error) {
    console.error("Error al obtener dimensiones:", error);
    toast.error("No se pudieron cargar las dimensiones. Intenta nuevamente.");
    return { message: "Error", factors: [] };
  }
};

export const createDimension = async (
  dimension: CreateDimensionProps
): Promise<DomainforDimension> => {
  try {
    const response = await axios.post(`/api/dimension`, dimension);

    toast.success("Dimensión creada correctamente.");
    return response.data;
  } catch (error) {
    console.error("Error al crear dimensión:", error);
    toast.error("No se pudo crear la dimensión.");

    // Retornar un objeto válido aunque vacío
    return {
      id: "",
      name: "",
      dimensions: [],
    };
  }
};

export const updateDimension = async (
  dimension: UpdateDimensionProps
): Promise<DomainforDimension> => {
  try {
    const response = await axios.put(`/api/dimension/${dimension.id}`, dimension);

    toast.success("Dimensión actualizada correctamente.");
    return response.data;
  } catch (error) {
    console.error("Error al actualizar dimensión:", error);
    toast.error("No se pudo actualizar la dimensión.");

    // Retornar un objeto válido aunque vacío
    return {
      id: "",
      name: "",
      dimensions: [],
    };
  }
};

export const deleteDimension = async (id: string) => {
  try {
    const response = await axios.delete(`/api/dimension/${id}`);

    toast.success("Dimensión eliminada correctamente.");
    return response.data;
  } catch (error) {
    console.error("Error al eliminar dimensión:", error);
    toast.error("No se pudo eliminar la dimensión.");

    // Retornar un objeto válido aunque vacío
    return {
      id: "",
      name: "",
      dimensions: [],
    };
  }
};