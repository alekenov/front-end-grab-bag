
import { useState, useEffect, useCallback } from "react";
import { ChatListContainer } from "@/components/chat/ChatListContainer";
import { ChatView } from "@/components/chat/ChatView";
import { AppLayout } from "@/components/layout/AppLayout";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

/**
 * Функция для нормализации ID чата
 * Преобразует строковые значения к единому формату
 */
const normalizeChatId = (chatId: string | null): string | null => {
  if (!chatId) return null;
  return chatId;
};

export default function ChatsPage() {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Обработчик изменения ID текущего чата
  const handleSetCurrentChatId = useCallback((id: string | null) => {
    if (id) {
      console.log("[ChatsPage] Setting current chat ID:", id);
      setCurrentChatId(id);
      
      // Обновляем URL при выборе чата
      navigate(`/?chatId=${id}`, { replace: true });
      
      // Если у чата есть непрочитанные сообщения, сбрасываем счетчик
      // Это должно быть реализовано на бэкенде
    } else {
      setCurrentChatId(null);
      navigate('/', { replace: true });
    }
    
    // Принудительно обновляем список чатов при смене чата
    queryClient.invalidateQueries({ queryKey: ['chats-api'] });
    queryClient.invalidateQueries({ queryKey: ['chats'] });
    
    setTimeout(() => {
      queryClient.refetchQueries({ queryKey: ['chats-api'] });
      queryClient.refetchQueries({ queryKey: ['chats'] });
    }, 300);
  }, [navigate, queryClient]);

  // Проверяем наличие параметра chatId в URL или сохраненный ID в localStorage
  useEffect(() => {
    // Сначала проверяем URL-параметр chatId
    const chatIdFromUrl = searchParams.get("chatId");
    
    if (chatIdFromUrl) {
      console.log("[ChatsPage] Setting current chat ID from URL:", chatIdFromUrl);
      setCurrentChatId(normalizeChatId(chatIdFromUrl));
      return;
    }
    
    // Если в URL нет параметра, проверяем localStorage
    const savedChatId = localStorage.getItem("current_chat_id");
    if (savedChatId) {
      console.log("[ChatsPage] Setting current chat ID from localStorage:", savedChatId);
      setCurrentChatId(normalizeChatId(savedChatId));
      
      // Обновляем URL
      navigate(`/?chatId=${savedChatId}`, { replace: true });
      
      // Очищаем localStorage, так как ID уже использован
      localStorage.removeItem("current_chat_id");
    }
  }, [searchParams, navigate]);

  // Настройка уведомлений о новых сообщениях
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
