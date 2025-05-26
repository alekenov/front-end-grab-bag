
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/ui/price-display";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Product } from "@/types/product";
import { useState } from "react";
import { EditProductDialog } from "../EditProductDialog";
import { useProductActions } from "../hooks/useProductActions";

interface ProductCardGridProps {
  product: Product;
  onDelete?: (id: string) => void;
  onUpdate?: (product: Product) => void;
  inChatMode?: boolean;
}

export function ProductCardGrid({ 
  product, 
  onDelete, 
  onUpdate, 
  inChatMode = false 
}: ProductCardGridProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { handleAddToChat } = useProductActions({ product, inChatMode });

  const handleEditProduct = () => {
    setEditDialogOpen(true);
  };

  return (
    <>
      <Card className="overflow-hidden">
        <div className="aspect-square relative">
          <img 
            src={product.imageUrl} 
            alt={product.name || "Букет"} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 flex space-x-1">
            <Button
              size="icon"
              className="h-8 w-8 rounded-full bg-[#1a73e8] hover:bg-[#1558b3] shadow-md"
              onClick={handleAddToChat}
              title="Добавить в чат"
            >
              <Plus className="h-4 w-4" />
            </Button>
            
            {!inChatMode && onUpdate && (
              <Button
                size="icon"
                className="h-8 w-8 rounded-full bg-amber-500 hover:bg-amber-600 shadow-md"
                onClick={handleEditProduct}
                title="Редактировать"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <CardContent className="p-2">
          <div className="flex items-center justify-between">
            <div>
              <PriceDisplay price={product.price} variant="primary" />
              {product.name && <div className="text-xs text-gray-500 truncate">{product.name}</div>}
              {product.category && <div className="text-xs text-gray-400">{product.category}</div>}
            </div>
            
            {!inChatMode && onDelete && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onDelete(product.id)}
                className="h-7 w-7 p-0"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
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
