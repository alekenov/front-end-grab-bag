
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

export function ChatList({ searchQuery, currentChatId, setCurrentChatId }: ChatListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Получение списка чатов
  const { 
    data: chats = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['chats'],
    queryFn: async () => {
      try {
        const { data: chatsData, error: chatsError } = await supabase
          .from('chats')
          .select('*')
          .order('updated_at', { ascending: false });
          
        if (chatsError) throw chatsError;
        
        // Получаем последние сообщения для каждого чата
        const chatsWithMessages = await Promise.all(
          chatsData.map(async (chat) => {
            // Запрашиваем последнее сообщение для этого чата
            const { data: messagesData } = await supabase
              .from('messages')
              .select('content, created_at')
              .eq('chat_id', chat.id)
              .order('created_at', { ascending: false })
              .limit(1);
              
            return {
              id: chat.id,
              name: chat.name,
              aiEnabled: chat.ai_enabled,
              unreadCount: chat.unread_count,
              lastMessage: messagesData && messagesData.length > 0 ? {
                content: messagesData[0].content,
                timestamp: messagesData[0].created_at
              } : undefined
            };
          })
        );
        
        return chatsWithMessages;
      } catch (error) {
        console.error('Error fetching chats:', error);
        throw error;
      }
    },
    // Добавим запасной вариант с тестовыми данными
    placeholderData: [
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
      }
    ]
  });

  // Мутация для обновления статуса AI в чате
  const toggleAIMutation = useMutation({
    mutationFn: async ({ chatId, enabled }: { chatId: string; enabled: boolean }) => {
      const { error } = await supabase
        .from('chats')
        .update({ ai_enabled: enabled })
        .eq('id', chatId);
        
      if (error) throw error;
      return { chatId, enabled };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      toast({
        title: `AI ${data.enabled ? 'включен' : 'выключен'}`,
        description: `AI был ${data.enabled ? 'включен' : 'выключен'} для выбранного чата`,
      });
    },
    onError: (error) => {
      console.error('Error toggling AI:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось изменить настройки AI",
      });
    }
  });

  async function toggleAI(chatId: string, enabled: boolean) {
    try {
      await toggleAIMutation.mutateAsync({ chatId, enabled });
    } catch (error) {
      console.error('Ошибка переключения AI:', error);
    }
  }

  // Фильтрация чатов на основе поискового запроса
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (chat.lastMessage && chat.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  function formatTime(timestamp: string) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const handleChatSelect = (id: string) => {
    setCurrentChatId(id);
    // Закрываем sheet на мобильных устройствах при выборе чата
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
