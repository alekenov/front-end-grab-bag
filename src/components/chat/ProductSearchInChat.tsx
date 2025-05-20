
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductsGrid } from "@/components/products/ProductsGrid";
import { useProductsSearch } from "@/hooks/products/useProductsSearch";
import { Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProductSearchInChatProps {
  currentChatId: string | null;
  onSelectProduct: (product: Product) => void;
}

export function ProductSearchInChat({ currentChatId, onSelectProduct }: ProductSearchInChatProps) {
  const [open, setOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useProductsSearch();
  
  // Очищаем поиск при закрытии диалога
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open, setSearchQuery]);

  // Если нет выбранного чата, отключаем компонент
  if (!currentChatId) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="h-9 px-3 flex items-center"
          onClick={() => {
            // Сохраняем ID текущего чата
            if (currentChatId) {
              localStorage.setItem("current_chat_id", currentChatId);
            }
          }}
        >
          <Search className="h-4 w-4 mr-2" />
          <span>Найти товар</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-[800px] h-[80vh] max-h-[800px]">
        <DialogHeader>
          <DialogTitle>Поиск товаров</DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex-1 overflow-y-auto h-full">
          <div className="mb-4 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Поиск по названию или цене..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                className="absolute right-2 top-2 h-6 w-6 p-0"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <ProductsGrid 
            inChatMode={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
