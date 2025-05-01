
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
}

export function ProductCard({ product, onDelete }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <img 
          src={product.imageUrl} 
          alt="Букет" 
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-3 flex items-center justify-between">
        <div className="font-medium text-lg">{product.price.toLocaleString()} ₸</div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDelete(product.id)}
          className="h-8 w-8 p-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
