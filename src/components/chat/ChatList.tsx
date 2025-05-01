
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Chat } from "@/types/chat";
import { ChatListItem } from "./ChatListItem";
import { useChatApi } from "@/hooks/chat";

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
  
  // Filter chats based on search query
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (chat.lastMessage && chat.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleChatSelect = (id: string) => {
    setCurrentChatId(id);
    // Close sheet on mobile devices when selecting a chat
    const sheet = document.querySelector('[data-state="open"]');
    if (sheet) {
      const closeButton = sheet.querySelector('button[data-state]') as HTMLButtonElement;
      closeButton?.click();
    }
  };

  if (isLoadingChats) return <div className="p-4 text-center text-gray-500">Загрузка чатов...</div>;
  
  if (chatsError) {
    console.error('Error loading chats:', chatsError);
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 mb-2">Ошибка загрузки чатов</div>
        <button 
          onClick={() => refetchChats()}
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    );
  }
  
  if (filteredChats.length === 0) return <div className="p-4 text-center text-gray-500">Нет активных чатов</div>;

  return (
    <ul className="list-none">
      {filteredChats.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          isActive={chat.id === currentChatId}
          onSelect={handleChatSelect}
          onToggleAI={toggleAI}
        />
      ))}
    </ul>
  );
}
