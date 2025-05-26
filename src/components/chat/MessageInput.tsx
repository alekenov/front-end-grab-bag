import { useState, useRef } from "react";
import { Send, Paperclip, Image, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Product } from "@/types/product";
import { useProductSelection, useChatNavigation, useChatUpdates } from "@/hooks/chat";
import { ProductSearchInChat } from "./ProductSearchInChat";

interface MessageInputProps {
  onSendMessage: (message: string, product?: Product) => void;
  disabled?: boolean;
  currentChatId?: string | null;
}

export function MessageInput({ onSendMessage, disabled = false, currentChatId }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Используем новые хуки
  const { navigateToProducts } = useChatNavigation();
  const { refreshAfterMessage } = useChatUpdates(currentChatId);
  const { processSelectedProduct } = useProductSelection(currentChatId);
  
  // Обработка выбранного товара
  processSelectedProduct(onSendMessage);
  
  const handleSend = () => {
    if (!message.trim() || disabled) return;
    
    console.log("[MessageInput] Sending message:", message);
    onSendMessage(message);
    setMessage("");
    
    // Обновляем данные через новый хук
    if (currentChatId) {
      refreshAfterMessage();
    }
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
        console.log('[MessageInput] Selected file:', file);
        toast({
          title: "Изображение выбрано",
          description: "Функция загрузки изображений в разработке",
        });
      }
    };
    input.click();
  };

  const handleProductsNavigate = () => {
    navigateToProducts(currentChatId);
  };

  // Если нет выбранного чата, не показываем ввод сообщения
  if (!currentChatId) {
    return null;
  }

  return (
    <div className="fixed left-0 right-0 bottom-14 md:sticky md:bottom-0 p-3 md:p-4 bg-white border-t border-[#e1e4e8] flex gap-2 z-20">
      <div className="flex items-center">
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
          <PopoverContent className="w-56 p-2">
            <div className="flex flex-col gap-2">
              <Button 
                variant="ghost" 
                className="justify-start gap-2" 
                onClick={handleFileSelect}
              >
                <Image className="h-5 w-5" />
                <span>Добавить фото</span>
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
      </div>
      
      <Textarea 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Введите сообщение..."
        className="min-h-[36px] max-h-32 resize-none rounded-2xl"
        ref={textareaRef}
        disabled={disabled}
      />
      
      <div className="flex items-center gap-2">
        <ProductSearchInChat
          currentChatId={currentChatId}
          onSelectProduct={(product) => {
            // Имитируем выбор продукта через localStorage
            localStorage.setItem("selected_product", JSON.stringify(product));
          }}
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
    </div>
  );
}
