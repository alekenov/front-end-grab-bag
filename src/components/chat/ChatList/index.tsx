
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ChatListItem } from "../ChatListItem";
import { TEST_CHATS } from '@/data/mockData';
import { Chat } from "@/types/chat";
import { getApiUrl, fetchWithFallback } from "@/utils/apiHelpers";

interface ChatListProps {
  searchQuery: string;
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
}

export function ChatList({ searchQuery, currentChatId, setCurrentChatId }: ChatListProps) {
  const { toast } = useToast();
  const API_URL = getApiUrl();
  
  const { data: chats = [], isLoading, error, refetch } = useQuery({
    queryKey: ['chats'],
    queryFn: () => fetchWithFallback<Chat[]>(`${API_URL}/chats`, TEST_CHATS),
    placeholderData: TEST_CHATS
  });

  // Filter chats based on search query
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (chat.lastMessage && chat.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  async function toggleAI(chatId: string, enabled: boolean) {
    try {
      const response = await fetch(`${API_URL}/chats/${chatId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aiEnabled: enabled }),
      });

      if (!response.ok) throw new Error('Ошибка обновления статуса AI');
      
      await refetch();
      toast({
        title: `AI ${enabled ? 'включен' : 'выключен'}`,
        description: `AI был ${enabled ? 'включен' : 'выключен'} для выбранного чата`,
      });
    } catch (error) {
      console.error('Ошибка переключения AI:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось изменить настройки AI",
      });
    }
  }

  const handleChatSelect = (id: string) => {
    setCurrentChatId(id);
    // Close sheet on mobile when selecting a chat
    const sheet = document.querySelector('[data-state="open"]');
    if (sheet) {
      const closeButton = sheet.querySelector('button[data-state]') as HTMLButtonElement;
      closeButton?.click();
    }
  };

  if (isLoading) return <div className="p-4 text-center text-gray-500">Загрузка чатов...</div>;
  
  if (error) {
    console.error('Error loading chats:', error);
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 mb-2">Ошибка загрузки чатов</div>
        <button 
          onClick={() => refetch()}
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
          onSelectChat={handleChatSelect}
          onToggleAI={toggleAI}
        />
      ))}
    </ul>
  );
}
