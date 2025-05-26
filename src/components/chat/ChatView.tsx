
import { useEffect, useState } from "react";
import { useChatApi } from "@/hooks/chat";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { EmptyState } from "./EmptyState";
import { DemoBanner } from "./DemoBanner";
import { ChatTabs } from "./tabs/ChatTabs";
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { useChatDetails } from "./hooks/useChatDetails";
import { useProductsApi } from "@/hooks/products/useProductsApi";
import { useChatRefresh } from "./hooks/useChatRefresh";

interface ChatViewProps {
  currentChatId: string | null;
  setCurrentChatId?: (id: string | null) => void;
}

export function ChatView({ currentChatId, setCurrentChatId }: ChatViewProps) {
  const { toast } = useToast();
  const chatApi = useChatApi();
  const { products = [] } = useProductsApi();
  
  // Нормализуем ID чата - если это число, считаем его тестовым демо-ID
  const normalizedChatId = currentChatId ? 
    (isNaN(Number(currentChatId)) || currentChatId.includes('-') ? currentChatId : `demo-${currentChatId}`) : null;
  
  // Определяем, является ли чат демо-чатом
  const isDemoChat = normalizedChatId?.startsWith('demo-');
  
  // Используем нормализованный ID для получения деталей чата
  const { chatName, setChatName, chatDetails } = useChatDetails(normalizedChatId);
  
  const [tabs, setTabs] = useState<string>("messages");
  const [tags, setTags] = useState<string[]>([]);
  
  // Используем хук для обновления данных
  const { forceRefresh } = useChatRefresh(normalizedChatId, isDemoChat || false);
  
  // Получаем сообщения чата с нормализованным ID
  const {
    data: messages = [],
    isLoading: messagesLoading,
    error: messagesError,
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

  return (
    <div className="flex flex-col h-full">
      <DemoBanner isDemoChat={isDemoChat || false} />
      
      <ChatHeader 
        onBack={() => setCurrentChatId?.(null)}
        contactName={chatName || "Новый контакт"}
        tags={tags}
        onUpdateContact={handleUpdateContact}
      />
      
      <ChatTabs
        tabs={tabs}
        setTabs={setTabs}
        messages={messages}
        messagesLoading={messagesLoading}
        isDemoChat={isDemoChat || false}
        normalizedChatId={normalizedChatId}
        products={products}
        onOrderCreated={forceRefresh}
      />
      
      <MessageInput 
        onSendMessage={handleSendMessage} 
        currentChatId={normalizedChatId}
      />
    </div>
  );
}
