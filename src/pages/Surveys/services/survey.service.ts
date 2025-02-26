import axios from 'axios';
import { Survey } from "@/models";

export const getSurveys = async (): Promise<Survey[]> => {
  try {
    const response = await axios.get('/api/survey');
    return response.data.surveys;
  } catch (error) {
    console.error('Error fetching surveys:', error);
    throw error;
  }
};
