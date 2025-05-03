
import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Image, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types/product";
import { useQueryClient } from "@tanstack/react-query";

interface MessageInputProps {
  onSendMessage: (message: string, product?: Product) => void;
  disabled?: boolean;
  currentChatId?: string | null;
}

export function MessageInput({ onSendMessage, disabled = false, currentChatId }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Check for selected product in localStorage on component mount
  useEffect(() => {
    const selectedProductJson = localStorage.getItem("selected_product");
    if (selectedProductJson) {
      try {
        const product = JSON.parse(selectedProductJson);
        console.log("Sending product from localStorage:", product);
        
        // Send the product to chat
        onSendMessage(`Букет за ${product.price.toLocaleString()} ₸`, product);
        // Clear the selected product from localStorage
        localStorage.removeItem("selected_product");
        
        // Максимально агрессивное обновление кэша списка чатов
        queryClient.invalidateQueries({ queryKey: ['chats-api'] });
        queryClient.invalidateQueries({ queryKey: ['chats'] });
        
        setTimeout(() => {
          queryClient.refetchQueries({ queryKey: ['chats-api'] });
          queryClient.refetchQueries({ queryKey: ['chats'] });
        }, 500);
        
        setTimeout(() => {
          queryClient.refetchQueries({ queryKey: ['chats-api'] });
          queryClient.refetchQueries({ queryKey: ['chats'] });
        }, 1500);
      } catch (error) {
        console.error("Error parsing selected product:", error);
      }
    }
  }, [onSendMessage, queryClient]);
  
  const handleSend = () => {
    if (!message.trim() || disabled) return;
    onSendMessage(message);
    setMessage("");
    
    // Максимально агрессивное обновление кэша списка чатов
    queryClient.invalidateQueries({ queryKey: ['chats-api'] });
    queryClient.invalidateQueries({ queryKey: ['chats'] });
    
    setTimeout(() => {
      queryClient.refetchQueries({ queryKey: ['chats-api'] });
      queryClient.refetchQueries({ queryKey: ['chats'] });
    }, 500);
    
    setTimeout(() => {
      queryClient.refetchQueries({ queryKey: ['chats-api'] });
      queryClient.refetchQueries({ queryKey: ['chats'] });
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('Selected file:', file);
        toast({
          title: "Изображение выбрано",
          description: "Функция загрузки изображений в разработке",
        });
      }
    };
    input.click();
  };

  const handleProductsNavigate = () => {
    // Сохраняем ID текущего чата перед переходом на страницу товаров
    if (currentChatId) {
      localStorage.setItem("current_chat_id", currentChatId);
      console.log("Saved current chat ID before navigation:", currentChatId);
    }
    navigate('/products', { state: { fromChat: true } });
  };

  return (
    <div className="fixed left-0 right-0 bottom-14 md:sticky md:bottom-0 p-3 md:p-4 bg-white border-t border-[#e1e4e8] flex gap-2 z-20">
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 shrink-0 rounded-full hover:bg-gray-100"
          >
            <Paperclip className="h-5 w-5 text-gray-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2">
          <div className="flex flex-col gap-2">
            <Button 
              variant="ghost" 
              className="justify-start gap-2" 
              onClick={handleFileSelect}
            >
              <Image className="h-5 w-5" />
              <span>Добавить медиа</span>
            </Button>
            <Button 
              variant="ghost" 
              className="justify-start gap-2" 
              onClick={handleProductsNavigate}
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Выбрать товар</span>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <Textarea 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Введите сообщение..."
        className="min-h-[36px] max-h-32 resize-none rounded-2xl"
        ref={textareaRef}
        disabled={disabled}
      />
      <Button 
        onClick={handleSend} 
        size="icon" 
        className="h-9 w-9 shrink-0 rounded-full bg-[#1a73e8] hover:bg-[#1558b3]"
        disabled={!message.trim() || disabled}
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
}
