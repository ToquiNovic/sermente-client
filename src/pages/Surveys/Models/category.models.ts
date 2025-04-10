// ./models/category.models.ts
import { SubcategoryBase } from "./subCategory.models";

export interface Category {
  id: string;
  name: string;
  description: string;
  surveyId: string;
  subcategories: SubcategoryBase[]; 
}

export interface CategoryForm {
  name: string;
  description: string;
}

export interface CreateCategoryProps {
  name: string;
  description: string;
  surveyId: string;
}

export interface UpdateCategoryProps {
  id: string;
  name: string;
  description: string;
}

export interface GetCategoriesResponse {
  message: string;
  categories: Category[];
}

