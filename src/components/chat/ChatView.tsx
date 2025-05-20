
import { useEffect, useState, useCallback, useRef } from "react";
import { useChatApi } from "@/hooks/chat";
import { MessageList } from "./MessageList";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { EmptyState } from "./EmptyState";
import { Product } from "@/types/product";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useChatDetails } from "./hooks/useChatDetails";
import { ChatOrders } from "./ChatOrders";
import { CreateOrderFromChat } from "./CreateOrderFromChat";
import { useProductsApi } from "@/hooks/products/useProductsApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChatViewProps {
  currentChatId: string | null;
  setCurrentChatId?: (id: string | null) => void;
}

export function ChatView({ currentChatId, setCurrentChatId }: ChatViewProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const chatApi = useChatApi();
  const { products = [] } = useProductsApi();
  
  // Нормализуем ID чата - если это число, считаем его тестовым демо-ID
  const normalizedChatId = currentChatId ? 
    (isNaN(Number(currentChatId)) || currentChatId.includes('-') ? currentChatId : `demo-${currentChatId}`) : null;
  
  // Используем нормализованный ID для получения деталей чата
  const { chatName, setChatName, chatDetails } = useChatDetails(normalizedChatId);
  
  const [tabs, setTabs] = useState<string>("messages");
  const [tags, setTags] = useState<string[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  // Получаем сообщения чата с нормализованным ID
  const {
    data: messages = [],
    isLoading: messagesLoading,
    error: messagesError,
    refetch: refetchMessages,
    isDemoChat
  } = chatApi.getMessages(normalizedChatId);
  
  // Логируем статус загрузки сообщений
  useEffect(() => {
    console.log("[ChatView] Chat ID (normalized):", normalizedChatId);
    console.log("[ChatView] Original Chat ID:", currentChatId);
    console.log("[ChatView] Chat details:", chatDetails);
    console.log("[ChatView] Messages loading:", messagesLoading);
    console.log("[ChatView] Messages error:", messagesError);
    console.log("[ChatView] Messages count:", messages?.length || 0);
    console.log("[ChatView] Is demo chat:", isDemoChat);
  }, [normalizedChatId, currentChatId, chatDetails, messages, messagesLoading, messagesError, isDemoChat]);
  
  // Автоскролл при новых сообщениях
  useEffect(() => {
    if (messages.length && messageEndRef.current) {
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages]);
  
  // Принудительное обновление данных
  const forceRefresh = useCallback(() => {
    if (!normalizedChatId) return;
    
    console.log("[ChatView] Force refreshing data for chat:", normalizedChatId);
    
    // Инвалидируем запросы в кеше
    queryClient.invalidateQueries({ queryKey: ['messages-api', normalizedChatId] });
    queryClient.invalidateQueries({ queryKey: ['chat', normalizedChatId] });
    queryClient.invalidateQueries({ queryKey: ['chats-api'] });
    queryClient.invalidateQueries({ queryKey: ['orders', 'chat', normalizedChatId] });
    
    // Принудительно запрашиваем данные
    setTimeout(() => {
      refetchMessages();
      chatApi.refetchChats();
    }, 100);
  }, [normalizedChatId, queryClient, refetchMessages, chatApi]);
  
  // Инициализация и периодическое обновление
  useEffect(() => {
    if (!normalizedChatId) return;
    
    console.log("[ChatView] Setting up chat view for:", normalizedChatId);
    
    // Обновляем данные при монтировании
    forceRefresh();
    
    // Проверяем наличие товара в localStorage
    const checkForProduct = () => {
      const selectedProductJson = localStorage.getItem("selected_product");
      if (selectedProductJson && normalizedChatId) {
        try {
          const product = JSON.parse(selectedProductJson);
          console.log("[ChatView] Found product in localStorage:", product);
          
          // Не отправляем товар в демо-чат
          if (normalizedChatId.startsWith('demo-')) {
            console.log("[ChatView] Skipping product send for demo chat");
            localStorage.removeItem("selected_product");
            return;
          }
          
          // Отправляем товар в чат
          chatApi.sendMessage(
            normalizedChatId, 
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
    
    // Настраиваем интервал обновления
    const intervalId = setInterval(() => {
      console.log("[ChatView] Checking for updates");
      if (!normalizedChatId.startsWith('demo-')) {
        refetchMessages();
        chatApi.refetchChats();
      }
    }, 5000);
    
    // Очистка при размонтировании
    return () => {
      clearInterval(intervalId);
      console.log("[ChatView] Cleaning up for chat:", normalizedChatId);
    };
  }, [normalizedChatId, chatApi, refetchMessages, toast, forceRefresh]);
  
  // Обработчик обновления контакта
  const handleUpdateContact = (name: string, tags: string[]) => {
    setChatName(name);
    setTags(tags);
    console.log("[ChatView] Contact updated:", { name, tags });
  };
  
  // Обработчик отправки сообщения
  const handleSendMessage = async (content: string, product?: Product) => {
    if (!normalizedChatId || !content.trim()) return;
    
    // Для демо-чата обрабатываем локально
    if (normalizedChatId.startsWith('demo-')) {
      // Здесь можно было бы добавить локальную обработку демо-сообщений
      toast({
        title: "Демо-режим",
        description: "В демо-режиме сообщения не сохраняются в базе данных",
      });
      return;
    }
    
    try {
      await chatApi.sendMessage(normalizedChatId, content, product);
      
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

  // Если нет выбранного чата, показываем пустое состояние
  if (!normalizedChatId) {
    return <EmptyState />;
  }

  // Проверяем наличие 'demo' в ID чата
  const isDemoChatView = normalizedChatId.startsWith('demo-');

  // Показываем предупреждение для демо-чата
  const demoBanner = isDemoChatView ? (
    <div className="bg-amber-100 p-2 text-center text-amber-800 text-sm border-b border-amber-200">
      Вы просматриваете демонстрационный чат. Сообщения не сохраняются в базе данных.
    </div>
  ) : null;

  return (
    <div className="flex flex-col h-full">
      {demoBanner}
      <ChatHeader 
        onBack={() => setCurrentChatId?.(null)}
        contactName={chatName || "Новый контакт"}
        tags={tags}
        onUpdateContact={handleUpdateContact}
      />
      
      <Tabs value={tabs} onValueChange={setTabs} className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b px-4">
          <TabsList className="h-10">
            <TabsTrigger value="messages" className="data-[state=active]:bg-transparent">Сообщения</TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-transparent">Заказы</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="messages" className="flex-1 overflow-y-auto bg-[#f5f7fb] p-0 m-0">
          <div className="px-4 py-6">
            <MessageList 
              messages={messages} 
              isLoading={messagesLoading && !isDemoChatView} 
            />
            <div ref={messageEndRef} className="h-8" />
          </div>
        </TabsContent>
        
        <TabsContent value="orders" className="flex-1 overflow-y-auto bg-[#f5f7fb] p-0 m-0">
          <div className="p-4 flex justify-end">
            {!isDemoChatView && (
              <CreateOrderFromChat 
                chatId={normalizedChatId} 
                products={products}
                onOrderCreated={forceRefresh}
              />
            )}
          </div>
          <ChatOrders chatId={normalizedChatId} />
        </TabsContent>
      </Tabs>
      
      <MessageInput 
        onSendMessage={handleSendMessage} 
        currentChatId={normalizedChatId}
      />
    </div>
  );
}
