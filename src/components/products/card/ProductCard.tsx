
import { Product } from "@/types/product";
import { ProductCardGrid } from "./ProductCardGrid";
import { ProductCardList } from "./ProductCardList";

interface ProductCardProps {
  product: Product;
  onDelete?: (id: string) => void;
  onUpdate?: (product: Product) => void;
  inChatMode?: boolean;
  viewMode?: "grid" | "list";
}

export function ProductCard({ 
  product, 
  onDelete, 
  onUpdate, 
  inChatMode = false,
  viewMode = "grid" 
}: ProductCardProps) {
  if (viewMode === "list") {
    return (
      <ProductCardList
        product={product}
        onDelete={onDelete}
        onUpdate={onUpdate}
        inChatMode={inChatMode}
      />
    );
  }

  return (
    <ProductCardGrid
      product={product}
      onDelete={onDelete}
      onUpdate={onUpdate}
      inChatMode={inChatMode}
    />
  );
}
