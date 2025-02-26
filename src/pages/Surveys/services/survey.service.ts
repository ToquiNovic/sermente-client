import axios from 'axios';
import { Survey, SurveyFormData, TypeSurvey, TypeSurveyResponse } from "@/models";

export const getSurveys = async (): Promise<Survey[]> => {
  try {
    const response = await axios.get('/api/survey');
    return response.data.surveys;
  } catch (error) {
    console.error('Error fetching surveys:', error);
    throw error;
  }
};

export const getAllTypesSurvey = async (): Promise<TypeSurvey[]> => {
  try {
    const response = await axios.get<TypeSurveyResponse>("/api/typesurvey");
    return response.data.typeSurveys;
  } catch (error) {
    console.error("Error fetching types:", error);
    throw error;
  }
};

export const getSurvey = async (id: string): Promise<Survey> => {
  try {
    const response = await axios.get(`/api/survey/${id}`);
    return response.data.survey;
  } catch (error) {
    console.error('Error fetching survey:', error);
    throw error;
  }
};

export const createSurvey = async (data: SurveyFormData): Promise<Survey> => {
  try {
    const response = await axios.post("/api/survey", data);
    return response.data.survey;
  } catch (error) {
    console.error("Error creating survey:", error);
    throw error;
  }
};
