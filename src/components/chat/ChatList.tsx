
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChatListItem } from "./ChatListItem";
import { useChatApi } from "@/hooks/chat";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader } from "lucide-react";

interface Filters {
  unreadOnly: boolean;
  whatsappOnly: boolean;
  telegramOnly: boolean;
  aiEnabled: boolean;
}

interface ChatListProps {
  searchQuery: string;
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
  filters: Filters;
}

export function ChatList({ searchQuery, currentChatId, setCurrentChatId, filters }: ChatListProps) {
  const { toast } = useToast();
  const { 
    chats, 
    isLoadingChats, 
    chatsError, 
    refetchChats,
    toggleAI 
  } = useChatApi();
  
  // Отладочный вывод для проверки данных
  console.log('[ChatList] Received chats:', chats);
  
  // Фильтрация чатов по поисковому запросу и фильтрам
  const filteredChats = Array.isArray(chats) ? chats.filter(chat => {
    // Фильтрация по поисковому запросу
    const matchesSearch = 
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (chat.lastMessage && chat.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Применяем дополнительные фильтры
    const matchesUnread = filters.unreadOnly ? chat.unreadCount && chat.unreadCount > 0 : true;
    const matchesWhatsapp = filters.whatsappOnly ? chat.source?.toLowerCase() === 'whatsapp' : true;
    const matchesTelegram = filters.telegramOnly ? chat.source?.toLowerCase() === 'telegram' : true;
    const matchesAI = filters.aiEnabled ? chat.aiEnabled : true;
    
    // Если выбраны оба фильтра - WhatsApp и Telegram, то возвращаем чаты из обоих источников
    const matchesMessengers = (filters.whatsappOnly || filters.telegramOnly) 
      ? (matchesWhatsapp || matchesTelegram) 
      : true;
    
    return matchesSearch && matchesUnread && matchesMessengers && matchesAI;
  }) : [];
  
  console.log('[ChatList] Filtered chats:', filteredChats);

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
          <AlertDescription>Не удалось загрузить список чатов. Причина: {chatsError.message}</AlertDescription>
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
  
  // Проверяем, есть ли активные фильтры
  const hasActiveFilters = filters.unreadOnly || filters.whatsappOnly || filters.telegramOnly || filters.aiEnabled;
  
  if (filteredChats.length === 0 && (searchQuery || hasActiveFilters)) {
    return (
      <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-3">
        <div className="text-5xl opacity-30">🔍</div>
        <div className="font-medium">Нет результатов</div>
        <div className="text-sm max-w-xs">
          {searchQuery && 
            <span>Не найдено чатов по запросу "<b>{searchQuery}</b>"</span>
          }
          {hasActiveFilters && 
            <div className="mt-1">Попробуйте изменить фильтры</div>
          }
        </div>
      </div>
    );
  }
  
  if (filteredChats.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Нет активных чатов в базе данных. Проверьте подключение к Supabase.
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
