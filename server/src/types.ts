export type AgeGroup = "0-2" | "3-5" | "6-8" | "9-12" | "13+";

export interface Product {
  id: number;
  article_id: string;
  name_ro: string;
  name_ru: string;
  name_en: string;
  description_ro?: string;
  description_ru?: string;
  description_en?: string;
  price: number;
  original_price?: number;
  stock: number;
  category: string;
  brand?: string;
  age_group?: AgeGroup;
  image_url: string;
  tags: string[];
  rating: number;
  reviews_count?: number;
  is_active?: boolean;
  created_at: string;
}

export type ProductInput = Omit<Product, "id" | "created_at">;
