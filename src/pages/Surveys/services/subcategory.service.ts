// services/subcategory.service.ts
import axios from "axios";
import { SubcategoryResponse, CreateSubcategoryProps, Subcategory, UpdateSubcategoryProps } from "../Models";

export const getSubcategoriesBySurveyId = async (
  surveyId: string
): Promise<SubcategoryResponse[]> => {
  try {
    const response = await axios.get(`/api/subcategory/${surveyId}/survey`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching subcategories", error);
    return [];
  }
}

export const createSubcategory = async (data: CreateSubcategoryProps): Promise<Subcategory> => {
  try {
    const response = await axios.post(`/api/subcategory`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating subcategory:", error);
    throw error;
  }
}

export const updateSubcategory = async (data: UpdateSubcategoryProps): Promise<Subcategory> => {
  try {
    const response = await axios.put(`/api/subcategory/${data.id}`, data);
    return response.data.subcategory;
  } catch (error) {
    console.error("Error updating subcategory:", error);
    throw error;
  }
}

export const deleteSubcategory = async (id: string) => {
  try {
    const response = await axios.delete(`/api/subcategory/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    throw error;
  }
}