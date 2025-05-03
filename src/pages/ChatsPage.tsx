
import { useState, useEffect } from "react";
import { ChatListContainer } from "@/components/chat/ChatListContainer";
import { ChatView } from "@/components/chat/ChatView";
import { AppLayout } from "@/components/layout/AppLayout";
import { useSearchParams } from "react-router-dom";

export default function ChatsPage() {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  // Проверяем наличие параметра chatId в URL или сохраненный ID в localStorage
  useEffect(() => {
    // Сначала проверяем URL-параметр chatId
    const chatIdFromUrl = searchParams.get("chatId");
    
    if (chatIdFromUrl) {
      setCurrentChatId(chatIdFromUrl);
      return;
    }
    
    // Если в URL нет параметра, проверяем localStorage
    const savedChatId = localStorage.getItem("current_chat_id");
    if (savedChatId) {
      setCurrentChatId(savedChatId);
      // Очищаем localStorage, так как ID уже использован
      localStorage.removeItem("current_chat_id");
    }
  }, [searchParams]);

  return (
    <AppLayout title="Чаты" activePage="chats">
      <div className="flex-1 flex flex-col overflow-hidden bg-[#f5f7fb]">
        {!currentChatId ? (
          <ChatListContainer 
            currentChatId={currentChatId}
            setCurrentChatId={setCurrentChatId}
          />
        ) : (
          <ChatView 
            currentChatId={currentChatId} 
            setCurrentChatId={setCurrentChatId} 
          />
        )}
      </div>
    </AppLayout>
  );
}
