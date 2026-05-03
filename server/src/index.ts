export type Language = "ro" | "ru" | "en";

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

export type ProductDraft = Omit<Product, "id" | "created_at"> & {
  id?: number;
  created_at?: string;
};

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ProductLocalizedField = "name" | "description";

export function getLocalizedField(
  product: Product,
  field: ProductLocalizedField,
  lang: Language,
): string {
  const key = `${field}_${lang}` as keyof Product;
  return (
    (product[key] as string) ||
    (product[`${field}_ro` as keyof Product] as string) ||
    ""
  );
}

export type SortOption =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "popular";

export interface ProductFilter {
  search?: string;
  category?: string;
  age_group?: AgeGroup;
  brand?: string;
  min_price?: number;
  max_price?: number;
  in_stock_only?: boolean;
  sort?: SortOption;
}
