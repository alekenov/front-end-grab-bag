
import { useQuery } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { TEST_CHATS } from '@/data/mockData';

// Define interfaces for type safety
interface Chat {
  id: string;
  name: string;
  aiEnabled: boolean;
  unreadCount?: number;
  lastMessage?: {
    content: string;
    timestamp: string;
  };
}

interface ChatListProps {
  searchQuery: string;
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
}

const TEST_CHATS_OLD = [
  {
    id: '1',
    name: 'Служба поддержки',
    aiEnabled: true,
    unreadCount: 3,
    lastMessage: {
      content: 'Добрый день, чем могу помочь?',
      timestamp: new Date().toISOString()
    }
  },
  {
    id: '2',
    name: 'Клиент Иван',
    aiEnabled: false,
    unreadCount: 1,
    lastMessage: {
      content: 'Когда будет доставка?',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  },
  {
    id: '3',
    name: 'Менеджер продаж',
    aiEnabled: true,
    unreadCount: 0,
    lastMessage: {
      content: 'Рассмотрел ваше предложение.',
      timestamp: new Date(Date.now() - 7200000).toISOString()
    }
  }
];

export function ChatList({ searchQuery, currentChatId, setCurrentChatId }: ChatListProps) {
  const { toast } = useToast();
  const API_URL = window.APP_CONFIG?.API_URL || '/api';
  
  console.log('Using API_URL:', API_URL);

  const { data: chats = [], isLoading, error, refetch } = useQuery({
    queryKey: ['chats'],
    queryFn: async () => {
      try {
        console.log('Fetching chats from:', `${API_URL}/chats`);
        const response = await fetch(`${API_URL}/chats`);
        
        // Log response details for debugging
        console.log('Chats response status:', response.status);
        const responseText = await response.text();
        console.log('Chats response body:', responseText);
        
        if (!response.ok) throw new Error(`Ошибка загрузки чатов: ${response.status}`);
        
        try {
          // Try to parse the response as JSON
          const data = JSON.parse(responseText);
          return data as Chat[];
        } catch (parseError) {
          console.error('Failed to parse response as JSON:', parseError);
          throw new Error('Invalid JSON response from server');
        }
      } catch (fetchError) {
        console.warn('Не удалось загрузить чаты, используем тестовые данные:', fetchError);
        return TEST_CHATS;
      }
    },
    // Всегда используем тестовые данные в качестве запасного варианта
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

  function formatTime(timestamp: string) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
        <li
          key={chat.id}
          className={`p-3 border-b border-[#f0f2f7] flex justify-between cursor-pointer transition-colors ${
            chat.id === currentChatId ? "bg-[#e8f0fe]" : "hover:bg-[#f5f7fb] active:bg-[#f0f2f7]"
          }`}
          onClick={() => handleChatSelect(chat.id)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-medium text-sm truncate">
                {chat.name}
              </span>
              {chat.unreadCount && chat.unreadCount > 0 && (
                <span className="shrink-0 bg-[#1a73e8] text-white text-xs font-medium px-1.5 py-0.5 rounded-full leading-none">
                  {chat.unreadCount}
                </span>
              )}
            </div>
            <span className="block text-xs text-gray-600 truncate">
              {chat.lastMessage ? chat.lastMessage.content : "Нет сообщений"}
            </span>
          </div>
          <div className="flex flex-col items-end ml-2.5 min-w-[60px]">
            <span className="text-xs text-gray-500 mb-1">
              {chat.lastMessage ? formatTime(chat.lastMessage.timestamp) : ""}
            </span>
            <Switch 
              checked={chat.aiEnabled} 
              onCheckedChange={(checked) => {
                const handleToggle = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  toggleAI(chat.id, checked);
                };
                handleToggle(event as unknown as React.MouseEvent);
              }}
              className="h-4 w-7 data-[state=checked]:bg-[#1a73e8]"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
