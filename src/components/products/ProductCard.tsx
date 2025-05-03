
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
  inChatMode?: boolean;
}

export function ProductCard({ product, onDelete, inChatMode = false }: ProductCardProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const handleAddToChat = () => {
    // Сохраняем выбранный товар в localStorage
    try {
      localStorage.setItem("selected_product", JSON.stringify(product));
      console.log("[ProductCard] Product saved to localStorage:", product);
      
      toast({
        title: "Товар добавлен",
        description: `Товар за ${product.price.toLocaleString()} ₸ добавлен в чат`,
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
        {!inChatMode && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDelete(product.id)}
            className="h-7 w-7 p-0"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
