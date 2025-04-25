
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { MessageList } from "./MessageList";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { EmptyState } from "./EmptyState";
import { Message } from "@/types/chat";
import { getApiUrl, fetchWithFallback } from "@/utils/apiHelpers";
import { TEST_MESSAGES, TEST_CHATS } from '@/data/mockData';

interface ChatViewProps {
  currentChatId: string | null;
  setCurrentChatId?: (id: string | null) => void;
}

export function ChatView({ currentChatId, setCurrentChatId }: ChatViewProps) {
  const [chatName, setChatName] = useState("");
  const { toast } = useToast();
  const API_URL = getApiUrl();
  
  const { data: chatDetails, error: chatError } = useQuery({
    queryKey: ['chat', currentChatId],
    queryFn: async () => {
      if (!currentChatId) return null;
      return fetchWithFallback(
        `${API_URL}/chats/${currentChatId}`, 
        { name: TEST_CHATS.find(c => c.id === currentChatId)?.name || "Чат" }
      );
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
      return fetchWithFallback<Message[]>(
        `${API_URL}/messages/${currentChatId}`, 
        TEST_MESSAGES[currentChatId] || []
      );
    },
    enabled: !!currentChatId
  });

  async function sendMessage(content: string) {
    if (!currentChatId) return;
    
    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: currentChatId,
          content,
          aiEnabled: chatDetails?.aiEnabled ?? true
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error sending message:', errorText);
        throw new Error('Ошибка отправки сообщения');
      }
      
      refetchMessages();
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      
      toast({
        title: "Сообщение отправлено",
        description: "Реального API нет, но сообщение было бы отправлено",
      });
      
      // Оптимистично обновляем UI
      refetchMessages();
    }
  }

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
      <ChatHeader 
        onBack={() => setCurrentChatId?.(null)} 
      />
      
      <div className="flex-1 overflow-y-auto px-3 py-5 md:px-5 bg-[#f5f7fb] pb-[88px] md:pb-[72px]">
        <MessageList messages={messages} isLoading={messagesLoading} />
      </div>
      
      <MessageInput onSendMessage={sendMessage} />
    </>
  );
}
