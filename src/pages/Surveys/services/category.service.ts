// services/category.service.ts
import axios from "axios";
import { Category, CreateCategoryProps, UpdateCategoryProps, GetCategoriesResponse } from "../Models";

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get("/api/category");
    return response.data;
  } catch (error) {
    console.error("error fetching categories", error);
    return [];
  }
};

export const createCategory = async (
  category: CreateCategoryProps
): Promise<Category> => {
  try {
    const response = await axios.post("/api/category", category);
    return response.data;
  } catch (error) {
    console.error("error creating category", error);
    throw error;
  }
};

export const updateCategory = async (
  category: UpdateCategoryProps
): Promise<Category> => {
  try {
    const response = await axios.put(`/api/category/${category.id}`, category);
    return response.data;
  } catch (error) {
    console.error("error updating category", error);
    throw error;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const response = await axios.delete(`/api/category/${id}`);
    return response.data;
  } catch (error) {
    console.error("error deleting category", error);
    throw error;
  }
};

export const getCategoriesbySurveyId = async (
  surveyId: string
): Promise<GetCategoriesResponse> => {
  try {
    const response = await axios.get(`/api/category/survey/${surveyId}`);
    return response.data;
  } catch (error) {
    console.error("error fetching categories", error);
    return { message: "Error", categories: [] };
  }
};
