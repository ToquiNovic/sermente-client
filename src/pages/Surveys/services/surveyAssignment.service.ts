// services/surveyAssignment.service.ts
import axios from "axios";
import { SurveyAssignment, SurveyAssignmentList } from "@/models";

export const postSurveyAssignment = async (assignments: SurveyAssignment | SurveyAssignmentList) => {
  try {
    const response = await axios.post("/api/surveys/assigned", assignments);
    console.log('Respuesta:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error al asignar encuesta:", error);
    throw error;
  }
};
