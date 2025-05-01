
import { ProductCard } from "./ProductCard";
import { Product } from "@/types/product";

interface ProductListProps {
  products: Product[];
  onDelete: (id: string) => void;
}

export function ProductList({ products, onDelete }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-500">
        <p className="text-center">Список товаров пуст</p>
        <p className="text-center text-sm mt-2">Добавьте новый товар, нажав на кнопку "+"</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
