
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChatListItem } from "./ChatListItem";
import { useChatApi } from "@/hooks/chat";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader } from "lucide-react";

interface ChatListProps {
  searchQuery: string;
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
}

export function ChatList({ searchQuery, currentChatId, setCurrentChatId }: ChatListProps) {
  const { toast } = useToast();
  const { 
    chats, 
    isLoadingChats, 
    chatsError, 
    refetchChats,
    toggleAI 
  } = useChatApi();
  
  // Фильтрация чатов по поисковому запросу (с проверкой на существование массива chats)
  const filteredChats = Array.isArray(chats) ? chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (chat.lastMessage && chat.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase()))
  ) : [];

  const handleChatSelect = (id: string) => {
    console.log("[ChatList] Selecting chat:", id);
    setCurrentChatId(id);
    
    // Закрываем sheet на мобильных устройствах при выборе чата
    const sheet = document.querySelector('[data-state="open"]');
    if (sheet) {
      const closeButton = sheet.querySelector('button[data-state]') as HTMLButtonElement;
      closeButton?.click();
    }
  };

  if (isLoadingChats) {
    return (
      <div className="p-4 text-center text-gray-500 flex flex-col items-center gap-2">
        <Loader className="h-5 w-5 animate-spin" />
        <span>Загрузка чатов...</span>
      </div>
    );
  }
  
  if (chatsError) {
    console.error('[ChatList] Ошибка загрузки чатов:', chatsError);
    return (
      <div className="p-4">
        <Alert variant="destructive" className="mb-2">
          <AlertTitle className="text-lg">Ошибка загрузки чатов</AlertTitle>
          <AlertDescription>Не удалось загрузить список чатов</AlertDescription>
        </Alert>
        <button 
          onClick={() => refetchChats()}
          className="w-full px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    );
  }
  
  if (filteredChats.length === 0 && searchQuery) {
    return (
      <div className="p-4 text-center text-gray-500">
        Нет чатов, соответствующих запросу "{searchQuery}"
      </div>
    );
  }
  
  if (filteredChats.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Нет активных чатов
      </div>
    );
  }

  return (
    <ul className="list-none">
      {filteredChats.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          isActive={chat.id === currentChatId}
          onSelectChat={handleChatSelect}
          onToggleAI={toggleAI}
        />
      ))}
    </ul>
  );
}
