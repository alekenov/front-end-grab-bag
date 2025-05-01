
export interface Product {
  id: string;
  imageUrl: string;
  price: number;
  createdAt: string;
}

export type NewProduct = Omit<Product, "id" | "createdAt">;
