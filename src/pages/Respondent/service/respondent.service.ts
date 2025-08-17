import axios, { AxiosError } from "axios";
import { QuestionsResponse, Survey } from "../type";
import { toast } from "sonner";

export const getQuestionsBySurveyId = async (surveyId: string) => {
  try {
    const { data } = await axios.get<QuestionsResponse>(
      `/api/question/survey/${surveyId}`
    );
    return data;
  } catch (error) {
    toast.error("Error al obtener preguntas");
    console.error("Error al obtener preguntas:", error);
    return null;
  }
};

export const getSurveyAsignments = async (
  userId: string
): Promise<Survey[]> => {
  try {
    const { data } = await axios.get<QuestionsResponse>(
      `/api/surveyassignment/user/${userId}`
    );
    return data.surveys ?? [];
  } catch (err: unknown) {
    console.error("Error al obtener asignaciones de encuestas:", err);

    if (err instanceof AxiosError && err.response?.status === 404) {
      return [];
    }

    toast.error("Error al obtener asignaciones de encuestas");
    return [];
  }
};

export const getSurveyById = async (surveyId: string) => {
  try {
    const { data } = await axios.get<{ survey: Survey }>(
      `/api/survey/${surveyId}`
    );
    return data.survey;
  } catch (error) {
    toast.error("Error al obtener encuesta");
    console.error("Error al obtener encuesta:", error);
    return null;
  }
};
