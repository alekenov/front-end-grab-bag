
import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageList } from "./MessageList";
import { EmptyState } from "./EmptyState";
import { useToast } from "@/hooks/use-toast";

interface ChatViewProps {
  currentChatId: string | null;
}

export function ChatView({ currentChatId }: ChatViewProps) {
  const [message, setMessage] = useState("");
  const [chatName, setChatName] = useState("");
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const API_URL = window.APP_CONFIG?.API_URL || '/api';

  const { data: chatDetails } = useQuery({
    queryKey: ['chat', currentChatId],
    queryFn: async () => {
      if (!currentChatId) return null;
      const response = await fetch(`${API_URL}/chats/${currentChatId}`);
      if (!response.ok) throw new Error('Ошибка загрузки деталей чата');
      return response.json();
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
    refetch: refetchMessages
  } = useQuery({
    queryKey: ['messages', currentChatId],
    queryFn: async () => {
      if (!currentChatId) return [];
      const response = await fetch(`${API_URL}/messages/${currentChatId}`);
      if (!response.ok) throw new Error('Ошибка загрузки сообщений');
      return response.json();
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

      if (!response.ok) throw new Error('Ошибка отправки сообщения');
      
      setMessage("");
      refetchMessages();
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось отправить сообщение",
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

  return (
    <>
      <div className="p-4 bg-white border-b border-[#e1e4e8]">
        <h2 className="text-lg font-semibold">{chatName || "Чат"}</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5">
        {messagesLoading ? (
          <div className="text-center text-gray-500">Загрузка сообщений...</div>
        ) : (
          <MessageList messages={messages} />
        )}
      </div>
      
      <div className="p-4 bg-white border-t border-[#e1e4e8] flex gap-3">
        <Textarea 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введите сообщение..."
          className="min-h-12 max-h-32 resize-none"
          ref={textareaRef}
        />
        <Button 
          onClick={sendMessage} 
          size="icon" 
          className="h-12 w-12 rounded-full bg-[#1a73e8] hover:bg-[#1558b3]"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
}
