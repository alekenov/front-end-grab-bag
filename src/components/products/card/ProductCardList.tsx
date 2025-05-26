
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/ui/price-display";
import { Trash2, Edit, ShoppingBag } from "lucide-react";
import { Product } from "@/types/product";
import { useState } from "react";
import { EditProductDialog } from "../EditProductDialog";
import { useProductActions } from "../hooks/useProductActions";

interface ProductCardListProps {
  product: Product;
  onDelete?: (id: string) => void;
  onUpdate?: (product: Product) => void;
  inChatMode?: boolean;
}

export function ProductCardList({ 
  product, 
  onDelete, 
  onUpdate, 
  inChatMode = false 
}: ProductCardListProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { handleAddToChat } = useProductActions({ product, inChatMode });

  const handleEditProduct = () => {
    setEditDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardContent className="p-3">
          <div className="flex gap-3">
            <div className="w-20 h-20 shrink-0">
              <img 
                src={product.imageUrl} 
                alt={product.name || "Букет"} 
                className="w-full h-full object-cover rounded"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{product.name || `Букет за ${product.price.toLocaleString()} ₸`}</div>
                  <PriceDisplay price={product.price} variant="primary" size="sm" />
                  {product.category && <div className="text-xs text-gray-400">{product.category}</div>}
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAddToChat}
                    className="h-8 gap-1"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">В чат</span>
                  </Button>
                  
                  {!inChatMode && (
                    <>
                      {onUpdate && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleEditProduct}
                          className="h-8"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      
                      {onDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(product.id)}
                          className="h-8"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              {product.description && (
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {product.description}
                </div>
              )}
              
              {product.quantity !== undefined && (
                <div className="text-xs mt-1">
                  <span className={product.quantity > 0 ? "text-green-600" : "text-red-500"}>
                    {product.quantity > 0 ? "В наличии" : "Нет в наличии"} 
                  </span>
                  {product.quantity > 0 && `: ${product.quantity} шт.`}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {onUpdate && (
        <EditProductDialog 
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          product={product}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}
