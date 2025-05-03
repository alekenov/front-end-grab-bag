
import { useEffect, useState } from "react";
import { useChatApi } from "@/hooks/chat";
import { MessageList } from "./MessageList";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { EmptyState } from "./EmptyState";
import { Product } from "@/types/product";
import { useQueryClient } from "@tanstack/react-query";

interface ChatViewProps {
  currentChatId: string | null;
  setCurrentChatId?: (id: string | null) => void;
}

export function ChatView({ currentChatId, setCurrentChatId }: ChatViewProps) {
  const queryClient = useQueryClient();
  const chatApi = useChatApi();
  const [name, setName] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  
  // Получаем детали чата
  const {
    data: messages = [],
    isLoading: messagesLoading,
    error: messagesError,
    refetch: refetchMessages,
  } = currentChatId ? chatApi.getMessages(currentChatId) : { data: [], isLoading: false, error: null, refetch: () => {} };
  
  // Эффект для проверки товара в localStorage и обработка обновлений
  useEffect(() => {
    if (!currentChatId) return;
    
    // Проверяем наличие продукта в localStorage
    const checkForProduct = () => {
      const selectedProductJson = localStorage.getItem("selected_product");
      if (selectedProductJson && currentChatId) {
        try {
          const product = JSON.parse(selectedProductJson);
          console.log("[ChatView] Found product in localStorage:", product);
          
          // Отправляем товар в чат
          chatApi.sendMessage(
            currentChatId, 
            `Букет за ${product.price.toLocaleString()} ₸`, 
            product
          );
          
          // Удаляем товар из localStorage
          localStorage.removeItem("selected_product");
          
          // Принудительно обновляем список чатов
          chatApi.refetchChats();
          
          // Обновляем сообщения текущего чата
          setTimeout(() => {
            refetchMessages();
          }, 500);
        } catch (error) {
          console.error("[ChatView] Error processing selected product:", error);
        }
      }
    };
    
    // Проверяем при монтировании
    checkForProduct();
    
    // Настраиваем интервал для периодической проверки
    const intervalId = setInterval(() => {
      console.log("[ChatView] Checking for product updates");
      refetchMessages();
      chatApi.refetchChats();
    }, 3000);
    
    // Очищаем интервал при размонтировании
    return () => clearInterval(intervalId);
  }, [currentChatId, chatApi, refetchMessages, queryClient]);
  
  // Обработчик обновления контакта - исправлен, чтобы соответствовать сигнатуре в ChatHeader
  const handleUpdateContact = (name: string, tags: string[]) => {
    setName(name);
    setTags(tags);
    console.log("[ChatView] Contact updated:", { name, tags });
  };
  
  // Обработчик отправки сообщения
  const handleSendMessage = async (content: string, product?: Product) => {
    if (!currentChatId) return;
    
    try {
      await chatApi.sendMessage(currentChatId, content, product);
      // Обновляем список сообщений
      setTimeout(() => {
        refetchMessages();
      }, 300);
    } catch (error) {
      console.error("[ChatView] Error sending message:", error);
    }
  };

  if (!currentChatId) {
    return <EmptyState />;
  }

  // Проверяем наличие demo в ID чата и создаем демо-сообщения если нужно
  const isDemoChat = currentChatId.startsWith('demo-');

  if (messagesError) {
    console.error('[ChatView] Messages error:', messagesError);
  }

  return (
    <>
      <ChatHeader 
        onBack={() => setCurrentChatId?.(null)}
        contactName={name || "Новый контакт"}
        tags={tags}
        onUpdateContact={handleUpdateContact}
      />
      
      <div className="flex-1 overflow-y-auto px-3 py-5 md:px-5 bg-[#f5f7fb] pb-[88px] md:pb-[72px]">
        <MessageList 
          messages={messages} 
          isLoading={messagesLoading && !isDemoChat} 
        />
      </div>
      
      <MessageInput 
        onSendMessage={handleSendMessage} 
        currentChatId={currentChatId}
      />
    </>
  );
}
