
export interface Product {
  id: string;
  name?: string;
  imageUrl: string;
  price: number;
  createdAt: string;
  category?: string;
  description?: string;
  availability?: boolean;
  quantity?: number;
}

export type NewProduct = Omit<Product, "id" | "createdAt">;

// Интерфейс для данных из Supabase
export interface SupabaseProduct {
  id: number;
  price: number;
  image_url: string | null;
  name: string;
  availability: boolean | null;
  quantity: number;
  description: string | null;
  category: string | null;
}
