
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Edit, ShoppingBag } from "lucide-react";
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { EditProductDialog } from "./EditProductDialog";

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
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const handleAddToChat = () => {
    // Сохраняем выбранный товар в localStorage
    try {
      localStorage.setItem("selected_product", JSON.stringify(product));
      console.log("[ProductCard] Product saved to localStorage:", product);
      
      toast({
        title: "Товар добавлен",
        description: `${product.name || `Товар за ${product.price.toLocaleString()} ₸`} добавлен в чат`,
      });
      
      // Максимально агрессивное обновление кэша списка чатов
      queryClient.invalidateQueries({ queryKey: ['chats-api'] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['chats-api'] });
        queryClient.refetchQueries({ queryKey: ['chats'] });
      }, 300);
      
      // Возвращаемся на страницу чата, если находимся в режиме выбора товара
      if (inChatMode) {
        // Получаем ID сохраненного чата
        const currentChatId = localStorage.getItem("current_chat_id");
        console.log("[ProductCard] Retrieved currentChatId for navigation:", currentChatId);
        
        // Переходим на главную страницу с указанием ID чата в URL
        if (currentChatId) {
          // Удаляем ID из localStorage
          localStorage.removeItem("current_chat_id");
          // Переходим к конкретному чату на главной странице
          setTimeout(() => {
            navigate(`/?chatId=${currentChatId}`);
          }, 100);
        } else {
          // Если по какой-то причине ID чата не был сохранен
          setTimeout(() => {
            navigate("/");
          }, 100);
        }
      }
    } catch (error) {
      console.error("[ProductCard] Error saving product:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить товар в чат",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = () => {
    setEditDialogOpen(true);
  };
  
  // Версия карточки для представления сеткой
  if (viewMode === "grid") {
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
                <div className="font-medium">{product.price.toLocaleString()} ₸</div>
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
  
  // Версия карточки для представления списком
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
                  <div className="text-sm font-bold text-[#1a73e8]">{product.price.toLocaleString()} ₸</div>
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
