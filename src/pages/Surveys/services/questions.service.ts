// src/pages/Surveys/services/questions.service.ts
import axios, { AxiosError } from "axios";
import { Question } from "../Models";

export const getQuestionsByDimenionId = async (dimensionId: string) => {
  try {
    const response = await axios.get(`/api/question/${dimensionId}`);
    const data = response.data;

    if (!data || !Array.isArray(data.questions)) {
      return { questions: [] };
    }

    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { questions: [] };
    }

    console.error("Error fetching questions:", error);
    throw error;
  }
};

export const createQuestion = async (
  subcategoryId: string,
  question: Question
) => {
  try {
    const response = await axios.post(`/api/question`, {
      subCategoryId: subcategoryId,
      ...question,
    });
    return response.data; 
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage =
        error.response?.data?.error || "Error desconocido al crear la pregunta";
      throw new Error(errorMessage); 
    } else {
      throw new Error("Error desconocido al crear la pregunta");
    }
  }
};

export const updateQuestion = async (
  questionId: string,
  question: Question
) => {
  const response = await axios.put(`/api/question/${questionId}`, question);
  return response.data;
};

export const deleteQuestion = async (questionId: string) => {
  const response = await axios.delete(`/api/question/${questionId}`);
  return response.data;
};

export const getQuestionBySurveyId = async (surveyId: string) => {
  const response = await axios.get(`/api/question/survey/${surveyId}`);
  return response.data;
};

export const updateQuestionPosition = async (
  questionId: string,
  newPosition: number
) => {
  const response = await axios.put(`/api/question/position/${questionId}`, {
    position: newPosition,
  });
  return response.data;
};
