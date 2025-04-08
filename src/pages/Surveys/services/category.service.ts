// services/category.service.ts
import axios from "axios";
import { Category, CreateCategoryProps } from "../Schemas";

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get("/api/categories");
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
    const response = await axios.post("/api/categories", category);
    return response.data;
  } catch (error) {
    console.error("error creating category", error);
    throw error;
  }
};
