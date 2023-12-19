export interface CategoryEntity {
  id_category: string;
  user_mail?: string;
  category_name: string;
}

export interface CategoriesTotal {
  category: string;
  total: number;
}
