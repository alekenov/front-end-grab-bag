
import { useState, useEffect, useCallback } from "react";
import { ChatListContainer } from "@/components/chat/ChatListContainer";
import { ChatView } from "@/components/chat/ChatView";
import { AppLayout } from "@/components/layout/AppLayout";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

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
      
      // При отсутствии чатов, создаем демо-чат
      if (id.startsWith('demo-')) {
        console.log("[ChatsPage] Using demo chat");
      }
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
      setCurrentChatId(chatIdFromUrl);
      return;
    }
    
    // Если в URL нет параметра, проверяем localStorage
    const savedChatId = localStorage.getItem("current_chat_id");
    if (savedChatId) {
      console.log("[ChatsPage] Setting current chat ID from localStorage:", savedChatId);
      setCurrentChatId(savedChatId);
      
      // Обновляем URL
      navigate(`/?chatId=${savedChatId}`, { replace: true });
      
      // Очищаем localStorage, так как ID уже использован
      localStorage.removeItem("current_chat_id");
    } else {
      // Если нет сохраненного ID, создаем демо-чат
      console.log("[ChatsPage] No chat ID found, using demo chat");
      const demoId = `demo-${Date.now()}`;
      setCurrentChatId(demoId);
      navigate(`/?chatId=${demoId}`, { replace: true });
      
      // Показываем уведомление о демо-чате
      toast({
        title: "Демо-чат",
        description: "Создан демонстрационный чат с примерами сообщений",
      });
    }
  }, [searchParams, navigate, toast]);

  return (
    <AppLayout title="Чаты" activePage="chats">
      <div className="flex-1 flex flex-col overflow-hidden bg-[#f5f7fb]">
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
