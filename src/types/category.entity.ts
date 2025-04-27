export interface CategoryEntity {
  id: number;
  userId?: string;
  name: string;
}

export interface CategoriesTotal {
  id: string;
  categoryName: string;
  value: number;
}

export interface PieChartData {
  id: number;
  value: number;
  label: string;
}
