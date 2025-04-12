// models/subCategory.models.ts
export interface SubcategoryBase {
  id: string;
  name: string;
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface SubcategoryResponse {
  idcategory: string;
  namecategory: string;
  subcategories: SubcategoryBase[];
}

export interface CreateSubcategoryProps {
  name: string;
  categoryId: string;
}

export interface UpdateSubcategoryProps {
  id: string;
  name: string;
}

export interface SubCategoriesTabProps {
  categoryId: string;
}
