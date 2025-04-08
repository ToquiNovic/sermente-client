// schema/category.schema.ts
export interface Category {
  id: string;
  name: string;
  description: string;
  surveyId: string;
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
