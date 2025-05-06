import { useEffect, useState, useCallback } from "react";
import { useChatApi } from "@/hooks/chat";
import { MessageList } from "./MessageList";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { EmptyState } from "./EmptyState";
import { Product } from "@/types/product";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useCustomerByChatId } from "@/hooks/customer/useCustomer";

interface ChatViewProps {
  currentChatId: string | null;
  setCurrentChatId?: (id: string | null) => void;
}

export function ChatView({ currentChatId, setCurrentChatId }: ChatViewProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const chatApi = useChatApi();
  const [name, setName] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  
  // Отладочная информация о текущем чате
  console.log('[DEBUG] ChatView - currentChatId:', currentChatId);
  
  // Получаем детали чата
  const currentChat = chatApi.chats.find(chat => chat.id === currentChatId);
  console.log('[DEBUG] ChatView - текущий чат:', currentChat);
  
  // Получаем данные клиента по ID чата
  const { data: customer, isLoading: customerLoading } = useCustomerByChatId(currentChatId);
  console.log('[DEBUG] ChatView - данные клиента:', customer);

  const {
    data: messages = [],
    isLoading: messagesLoading,
    error: messagesError,
    refetch: refetchMessages,
  } = currentChatId ? chatApi.getMessages(currentChatId) : { data: [], isLoading: false, error: null, refetch: () => Promise.resolve() };
  
  // Логируем информацию о загруженных сообщениях
  console.log('[DEBUG] ChatView - Загружено сообщений:', messages.length);
  console.log('[DEBUG] ChatView - messagesError:', messagesError);
  
  // Принудительно обновляем данные при монтировании компонента
  const forceRefresh = useCallback(() => {
    if (!currentChatId) return;
    
    console.log("[ChatView] Force refreshing data for chat:", currentChatId);
    
    // Инвалидируем и обновляем данные
    queryClient.invalidateQueries({ queryKey: ['messages-api', currentChatId] });
    queryClient.invalidateQueries({ queryKey: ['chats-api'] });
    
    // Явно запрашиваем обновление данных
    setTimeout(() => {
      refetchMessages();
      chatApi.refetchChats();
    }, 100);
  }, [currentChatId, queryClient, refetchMessages, chatApi]);
  
  // Эффект для проверки товара в localStorage и обработка обновлений
  useEffect(() => {
    if (!currentChatId) return;
    
    console.log("[ChatView] Setting up chat view for:", currentChatId);
    
    // Форсируем обновление данных при монтировании компонента
    forceRefresh();
    
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
          ).then(() => {
            toast({
              title: "Товар добавлен",
              description: `Букет за ${product.price.toLocaleString()} ₸ добавлен в чат`,
            });
            
            // Удаляем товар из localStorage
            localStorage.removeItem("selected_product");
            
            // Обновляем UI
            forceRefresh();
          }).catch(err => {
            console.error("[ChatView] Error sending product message:", err);
          });
        } catch (error) {
          console.error("[ChatView] Error processing selected product:", error);
        }
      }
    };
    
    // Проверяем при монтировании
    checkForProduct();
    
    // Настраиваем интервал для периодической проверки
    const intervalId = setInterval(() => {
      console.log("[ChatView] Checking for updates");
      refetchMessages();
      chatApi.refetchChats();
    }, 5000);
    
    // Очищаем интервал при размонтировании
    return () => {
      clearInterval(intervalId);
      console.log("[ChatView] Cleaning up for chat:", currentChatId);
    };
  }, [currentChatId, chatApi, refetchMessages, queryClient, forceRefresh, toast]);
  
  // Обработчик обновления контакта
  const handleUpdateContact = (name: string, tags: string[]) => {
    setName(name);
    setTags(tags);
    console.log("[ChatView] Contact updated:", { name, tags });
  };
  
  // Обработчик отправки сообщения с обработкой ошибок
  const handleSendMessage = async (content: string, product?: Product) => {
    if (!currentChatId || !content.trim()) return;
    
    try {
      await chatApi.sendMessage(currentChatId, content, product);
      
      // Обновляем список сообщений
      setTimeout(() => {
        forceRefresh();
      }, 300);
    } catch (error) {
      console.error("[ChatView] Error sending message:", error);
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить сообщение",
        variant: "destructive",
      });
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
      {/* Хедер с информацией о контакте */}
      <ChatHeader 
        phoneNumber={customer?.phone || ""} 
        contactName={currentChat?.name} 
        tags={tags}
        onBack={() => setCurrentChatId && setCurrentChatId(null)}
        onUpdateContact={(name, tags) => {
          setName(name);
          setTags(tags);
          // Здесь будет вызов API для обновления данных контакта
          toast({
            title: "Данные обновлены",
            description: "Информация о контакте сохранена"
          });
        }}
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
