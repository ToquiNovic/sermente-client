// ./models/category.models.ts
import { SubcategoryBase } from "./subCategory.models";
import { Option } from "./question.models";

export interface QuestionbyCategory {
  id: string;
  text: string;
  position: number;
  subcategoryId: string;
  options: Option[];
}

export interface SubcategoryforCategory extends SubcategoryBase {
  status: string;
  categoryId: string;
  questions: QuestionbyCategory[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  surveyId: string;
  status: string;
  subcategories: SubcategoryforCategory[];
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
