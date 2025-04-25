import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Send, User, Phone, Paperclip, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageList } from "./MessageList";
import { EmptyState } from "./EmptyState";
import { useToast } from "@/hooks/use-toast";
import { TEST_MESSAGES, TEST_CHATS } from '@/data/mockData';

interface ChatViewProps {
  currentChatId: string | null;
  setCurrentChatId?: (id: string | null) => void;
}

export function ChatView({ currentChatId, setCurrentChatId }: ChatViewProps) {
  const [message, setMessage] = useState("");
  const [chatName, setChatName] = useState("");
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const API_URL = window.APP_CONFIG?.API_URL || '/api';
  
  console.log('ChatView using API_URL:', API_URL, 'for chat ID:', currentChatId);

  const { data: chatDetails, error: chatError } = useQuery({
    queryKey: ['chat', currentChatId],
    queryFn: async () => {
      if (!currentChatId) return null;
      try {
        console.log('Fetching chat details from:', `${API_URL}/chats/${currentChatId}`);
        const response = await fetch(`${API_URL}/chats/${currentChatId}`);
        
        console.log('Chat details response status:', response.status);
        const responseText = await response.text();
        console.log('Chat details response body:', responseText);
        
        if (!response.ok) throw new Error('Ошибка загрузки деталей чата');
        
        try {
          return JSON.parse(responseText);
        } catch (parseError) {
          console.error('Failed to parse chat details as JSON:', parseError);
          return { name: TEST_CHATS.find(c => c.id === currentChatId)?.name || "Чат" };
        }
      } catch (error) {
        console.warn('Error fetching chat details, using test data:', error);
        return { name: TEST_CHATS.find(c => c.id === currentChatId)?.name || "Чат" };
      }
    },
    enabled: !!currentChatId
  });

  useEffect(() => {
    if (chatDetails) {
      setChatName(chatDetails.name || "");
    }
  }, [chatDetails]);

  const { 
    data: messages = [],
    isLoading: messagesLoading,
    refetch: refetchMessages,
    error: messagesError
  } = useQuery({
    queryKey: ['messages', currentChatId],
    queryFn: async () => {
      if (!currentChatId) return [];
      try {
        console.log('Fetching messages from:', `${API_URL}/messages/${currentChatId}`);
        const response = await fetch(`${API_URL}/messages/${currentChatId}`);
        
        console.log('Messages response status:', response.status);
        const responseText = await response.text();
        console.log('Messages response body:', responseText);
        
        if (!response.ok) throw new Error('Ошибка загрузки сообщений');
        
        try {
          return JSON.parse(responseText);
        } catch (parseError) {
          console.error('Failed to parse messages as JSON:', parseError);
          return TEST_MESSAGES[currentChatId] || [];
        }
      } catch (error) {
        console.warn('Используем тестовые сообщения:', error);
        return TEST_MESSAGES[currentChatId] || [];
      }
    },
    enabled: !!currentChatId
  });

  async function sendMessage() {
    if (!message.trim() || !currentChatId) return;
    
    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: currentChatId,
          content: message,
          aiEnabled: chatDetails?.aiEnabled ?? true
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error sending message:', errorText);
        throw new Error('Ошибка отправки сообщения');
      }
      
      setMessage("");
      refetchMessages();
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      
      const newMessage = {
        id: `temp-${Date.now()}`,
        content: message,
        role: 'USER',
        timestamp: new Date().toISOString()
      };
      
      setMessage("");
      
      toast({
        title: "Сообщение отправлено",
        description: "Реального API нет, но сообщение было бы отправлено",
      });
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!currentChatId) {
    return <EmptyState />;
  }

  if (chatError) {
    console.error('Chat details error:', chatError);
  }

  if (messagesError) {
    console.error('Messages error:', messagesError);
  }

  return (
    <>
      <div className="sticky top-0 z-10 p-4 bg-white border-b border-[#e1e4e8]">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 shrink-0"
            onClick={() => setCurrentChatId?.(null)}
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Phone size={18} className="text-gray-500" />
              <h2 className="text-lg font-semibold truncate">+7 (999) 123-45-67</h2>
            </div>
            <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User size={14} />
                <span>Иван Петров</span>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">пионы</span>
                <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">самовывоз</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-3 py-5 md:px-5 bg-[#f5f7fb] pb-[88px] md:pb-[72px]">
        {messagesLoading ? (
          <div className="text-center text-gray-500">Загрузка сообщений...</div>
        ) : (
          <MessageList messages={messages} />
        )}
      </div>
      
      <div className="fixed left-0 right-0 bottom-14 md:sticky md:bottom-0 p-3 md:p-4 bg-white border-t border-[#e1e4e8] flex gap-2 z-20">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 shrink-0 rounded-full hover:bg-gray-100"
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                console.log('Selected file:', file);
                toast({
                  title: "Изображение выбрано",
                  description: "Функция загрузки изображений в разработке",
                });
              }
            };
            input.click();
          }}
        >
          <Paperclip className="h-5 w-5 text-gray-500" />
        </Button>
        <Textarea 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введите сообщение..."
          className="min-h-[36px] max-h-32 resize-none rounded-2xl"
          ref={textareaRef}
        />
        <Button 
          onClick={sendMessage} 
          size="icon" 
          className="h-9 w-9 shrink-0 rounded-full bg-[#1a73e8] hover:bg-[#1558b3]"
          disabled={!message.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
}
