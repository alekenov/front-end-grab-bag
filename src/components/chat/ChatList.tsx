
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface Chat {
  id: string;
  name: string;
  aiEnabled: boolean;
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
  const API_URL = window.APP_CONFIG?.API_URL || '/api';

  const { data: chats = [], isLoading, error, refetch } = useQuery({
    queryKey: ['chats'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/chats`);
      if (!response.ok) throw new Error('Ошибка загрузки чатов');
      return response.json() as Promise<Chat[]>;
    }
  });

  // Filter chats based on search query
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (chat.lastMessage && chat.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  async function toggleAI(chatId: string, enabled: boolean) {
    // Fix: Removed the event parameter that was causing the type error
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

  if (isLoading) return <div className="p-4 text-center text-gray-500">Загрузка чатов...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Ошибка загрузки чатов</div>;
  if (filteredChats.length === 0) return <div className="p-4 text-center text-gray-500">Нет активных чатов</div>;

  return (
    <ul className="list-none">
      {filteredChats.map((chat) => (
        <li
          key={chat.id}
          className={`p-3 border-b border-[#f0f2f7] flex justify-between cursor-pointer ${
            chat.id === currentChatId ? "bg-[#e8f0fe]" : "hover:bg-[#f5f7fb]"
          }`}
          onClick={() => setCurrentChatId(chat.id)}
        >
          <div className="flex-1 min-w-0">
            <span className="block font-medium text-sm mb-0.5 truncate">{chat.name}</span>
            <span className="block text-xs text-gray-600 truncate">
              {chat.lastMessage ? chat.lastMessage.content : "Нет сообщений"}
            </span>
          </div>
          <div className="flex flex-col items-end ml-2.5">
            <span className="text-xs text-gray-500 mb-1">
              {chat.lastMessage ? formatTime(chat.lastMessage.timestamp) : ""}
            </span>
            <Switch 
              checked={chat.aiEnabled} 
              onCheckedChange={(checked) => {
                // Prevent chat selection when toggling AI
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
