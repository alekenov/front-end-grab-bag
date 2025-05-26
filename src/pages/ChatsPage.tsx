import { useState, useEffect, useCallback } from "react";
import { ChatListContainer } from "@/components/chat/ChatListContainer";
import { ChatView } from "@/components/chat/ChatView";
import { AppLayout } from "@/components/layout/AppLayout";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useChatNavigation } from "@/hooks/chat";

export default function ChatsPage() {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Используем новый хук для навигации
  const { normalizeChatId, setCurrentChatId: navigateToChat } = useChatNavigation();

  // Обработчик изменения ID текущего чата
  const handleSetCurrentChatId = useCallback((id: string | null) => {
    const normalizedId = normalizeChatId(id);
    setCurrentChatId(normalizedId);
    navigateToChat(normalizedId);
  }, [normalizeChatId, navigateToChat]);

  // Проверяем наличие параметра chatId в URL или сохраненный ID в localStorage
  useEffect(() => {
    // Сначала проверяем URL-параметр chatId
    const chatIdFromUrl = searchParams.get("chatId");
    
    if (chatIdFromUrl) {
      console.log("[ChatsPage] Setting current chat ID from URL:", chatIdFromUrl);
      const normalizedId = normalizeChatId(chatIdFromUrl);
      setCurrentChatId(normalizedId);
      return;
    }
    
    // Если в URL нет параметра, проверяем localStorage
    const savedChatId = localStorage.getItem("current_chat_id");
    if (savedChatId) {
      console.log("[ChatsPage] Setting current chat ID from localStorage:", savedChatId);
      const normalizedId = normalizeChatId(savedChatId);
      setCurrentChatId(normalizedId);
      
      // Навигируем к чату
      navigateToChat(normalizedId);
      
      // Очищаем localStorage, так как ID уже использован
      localStorage.removeItem("current_chat_id");
    }
  }, [searchParams, normalizeChatId, navigateToChat]);

  // Функция для показа уведомления о новом сообщении
  useEffect(() => {
    // Функция для показа уведомления о новом сообщении
    const showNewMessageNotification = (chatName: string, message: string) => {
      toast({
        title: `Новое сообщение от ${chatName}`,
        description: message,
        duration: 5000,
      });
      
      // Воспроизведение звука уведомления (можно добавить при необходимости)
      // const audio = new Audio('/sounds/notification.mp3');
      // audio.play().catch(err => console.error('Error playing notification sound:', err));
    };
    
    // Здесь должна быть логика подписки на события новых сообщений
    // Например, через WebSocket или периодический опрос API
    
    return () => {
      // Отписка от событий при размонтировании компонента
    };
  }, [toast]);

  return (
    <AppLayout title="Чаты" activePage="chats">
      <div className="flex h-full w-full overflow-hidden">
        {!currentChatId ? (
          <ChatListContainer 
            currentChatId={currentChatId}
            setCurrentChatId={handleSetCurrentChatId}
          />
        ) : (
          <ChatView 
            currentChatId={currentChatId} 
            setCurrentChatId={handleSetCurrentChatId} 
          />
        )}
      </div>
    </AppLayout>
  );
}
