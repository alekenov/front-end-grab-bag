
import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageList } from "./MessageList";
import { EmptyState } from "./EmptyState";
import { useToast } from "@/hooks/use-toast";
import { TEST_MESSAGES, TEST_CHATS } from '@/data/mockData';

interface ChatViewProps {
  currentChatId: string | null;
}

export function ChatView({ currentChatId }: ChatViewProps) {
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
        
        // Log response for debugging
        console.log('Chat details response status:', response.status);
        const responseText = await response.text();
        console.log('Chat details response body:', responseText);
        
        if (!response.ok) throw new Error('Ошибка загрузки деталей чата');
        
        try {
          // Try to parse response as JSON
          return JSON.parse(responseText);
        } catch (parseError) {
          console.error('Failed to parse chat details as JSON:', parseError);
          // Return a minimal mock object with the chat name
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
        
        // Log response for debugging
        console.log('Messages response status:', response.status);
        const responseText = await response.text();
        console.log('Messages response body:', responseText);
        
        if (!response.ok) throw new Error('Ошибка загрузки сообщений');
        
        try {
          // Try to parse response as JSON
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
      
      // Simulate message sending for testing
      const newMessage = {
        id: `temp-${Date.now()}`,
        content: message,
        role: 'USER',
        timestamp: new Date().toISOString()
      };
      
      // Add message to local state and clear input
      setMessage("");
      
      // Mock refetch by showing toast
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
      <div className="sticky top-0 z-10 p-4 bg-white border-b border-[#e1e4e8] flex items-center gap-4">
        <h2 className="text-lg font-semibold truncate flex-1">{chatName || "Чат"}</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto px-3 py-5 md:px-5 bg-[#f5f7fb] pb-[88px] md:pb-[72px]">
        {messagesLoading ? (
          <div className="text-center text-gray-500">Загрузка сообщений...</div>
        ) : (
          <MessageList messages={messages} />
        )}
      </div>
      
      <div className="fixed left-0 right-0 bottom-14 md:sticky md:bottom-0 p-3 md:p-4 bg-white border-t border-[#e1e4e8] flex gap-2 z-20">
        <Textarea 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введите сообщение..."
          className="min-h-[44px] max-h-32 resize-none rounded-2xl"
          ref={textareaRef}
        />
        <Button 
          onClick={sendMessage} 
          size="icon" 
          className="h-11 w-11 shrink-0 rounded-full bg-[#1a73e8] hover:bg-[#1558b3]"
          disabled={!message.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
}
