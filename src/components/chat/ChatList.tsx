
import { useChatApi } from "@/hooks/chat";
import { ChatListItem } from "./ChatListItem";

interface ChatListProps {
  searchQuery: string;
  currentChatId: string | null;
  setCurrentChatId: (id: string) => void;
  filters?: {
    unreadOnly?: boolean;
    whatsappOnly?: boolean;
    telegramOnly?: boolean;
    aiEnabled?: boolean;
  };
}

/**
 * Проверка, является ли чат активным, с учетом нормализации ID
 */
const isChatActive = (currentId: string | null, chatId: string): boolean => {
  if (!currentId) return false;
  
  // Проверка на равенство с учетом возможной нормализации ID (для демо-чатов)
  if (currentId === chatId) return true;
  
  // Проверка для числовых ID (демо-чаты)
  if (currentId.startsWith('demo-') && 
      !isNaN(Number(currentId.replace('demo-', ''))) && 
      currentId.replace('demo-', '') === chatId) {
    return true;
  }
  
  // Проверка в обратную сторону
  if (chatId.startsWith('demo-') && 
      !isNaN(Number(chatId.replace('demo-', ''))) && 
      chatId.replace('demo-', '') === currentId) {
    return true;
  }
  
  return false;
};

export function ChatList({ searchQuery, currentChatId, setCurrentChatId, filters = {} }: ChatListProps) {
  const chatApi = useChatApi();
  // Fix 1: Use chats, isLoadingChats directly instead of calling getChats()
  const { chats = [], isLoadingChats: isLoading } = chatApi;
  
  // Фильтрация чатов
  const filteredChats = chats.filter(chat => {
    // Фильтр по поисковому запросу
    if (searchQuery && !chat.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Применяем фильтры
    if (filters.unreadOnly && (!chat.unreadCount || chat.unreadCount <= 0)) {
      return false;
    }
    
    if (filters.whatsappOnly && chat.source !== 'whatsapp') {
      return false;
    }
    
    if (filters.telegramOnly && chat.source !== 'telegram') {
      return false;
    }
    
    if (filters.aiEnabled && !chat.aiEnabled) {
      return false;
    }
    
    return true;
  });
  
  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500">
        <div className="inline-block w-6 h-6 border-2 border-t-blue-500 border-r-blue-500 border-b-blue-500 border-l-transparent rounded-full animate-spin mb-2"></div>
        <div>Загрузка чатов...</div>
      </div>
    );
  }
  
  if (filteredChats.length === 0) {
    if (searchQuery || Object.values(filters).some(value => value)) {
      // Если есть поисковый запрос или активные фильтры
      return (
        <div className="p-6 text-center">
          <div className="text-gray-500 mb-2">Нет чатов, соответствующих критериям поиска</div>
          {searchQuery && (
            <div className="text-sm text-gray-400">Поиск: "{searchQuery}"</div>
          )}
        </div>
      );
    }
    
    return (
      <div className="p-6 text-center text-gray-500">
        <div className="mb-2">У вас пока нет активных чатов</div>
      </div>
    );
  }
  
  return (
    <div className="divide-y divide-gray-100">
      {filteredChats.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          isActive={isChatActive(currentChatId, chat.id)}
          // Fix 2: Use onSelectChat instead of onClick
          onSelectChat={() => setCurrentChatId(chat.id)}
        />
      ))}
    </div>
  );
}
