
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
}

export function ProductCard({ product, onDelete }: ProductCardProps) {
  const { toast } = useToast();
  
  const handleAddToChat = () => {
    // For now just show a toast notification
    toast({
      title: "Товар добавлен",
      description: `Товар за ${product.price.toLocaleString()} ₸ добавлен в чат`,
    });
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <img 
          src={product.imageUrl} 
          alt="Букет" 
          className="w-full h-full object-cover"
        />
        <Button
          size="icon"
          className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-[#1a73e8] hover:bg-[#1558b3] shadow-md"
          onClick={handleAddToChat}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="p-2 flex items-center justify-between">
        <div className="font-medium">{product.price.toLocaleString()} ₸</div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDelete(product.id)}
          className="h-7 w-7 p-0"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </CardContent>
    </Card>
  );
}
