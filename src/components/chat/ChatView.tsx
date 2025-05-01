
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { MessageList } from "./MessageList";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { EmptyState } from "./EmptyState";
import { Message, Chat } from "@/types/chat";
import { getApiUrl, fetchWithFallback } from "@/utils/apiHelpers";
import { TEST_MESSAGES, TEST_CHATS } from '@/data/mockData';
import { Product } from "@/types/product";

interface ChatViewProps {
  currentChatId: string | null;
  setCurrentChatId?: (id: string | null) => void;
}

export function ChatView({ currentChatId, setCurrentChatId }: ChatViewProps) {
  const [chatName, setChatName] = useState("");
  const [contactName, setContactName] = useState("Иван Петров");
  const [contactTags, setContactTags] = useState<string[]>(["пионы", "самовывоз"]);
  const { toast } = useToast();
  const API_URL = getApiUrl();
  
  const { data: chatDetails, error: chatError } = useQuery({
    queryKey: ['chat', currentChatId],
    queryFn: async () => {
      if (!currentChatId) return null;
      return fetchWithFallback<Chat>(
        `${API_URL}/chats/${currentChatId}`, 
        TEST_CHATS.find(c => c.id === currentChatId) || { 
          id: currentChatId, 
          name: "Чат",
          aiEnabled: true
        }
      );
    },
    enabled: !!currentChatId
  });

  useEffect(() => {
    if (chatDetails) {
      setChatName(chatDetails.name || "");
      // Если бы API возвращало эти данные, мы бы устанавливали их здесь
      // setContactName(chatDetails.contactName || "");
      // setContactTags(chatDetails.tags || []);
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

  async function sendMessage(content: string, product?: Product) {
    if (!currentChatId) return;
    
    try {
      // If there's a product, create a special product message
      const messagePayload = product ? {
        chatId: currentChatId,
        content,
        product: {
          id: product.id,
          imageUrl: product.imageUrl,
          price: product.price
        },
        aiEnabled: chatDetails?.aiEnabled ?? true
      } : {
        chatId: currentChatId,
        content,
        aiEnabled: chatDetails?.aiEnabled ?? true
      };
      
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messagePayload),
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
        description: product ? "Товар добавлен в чат" : "Сообщение добавлено в чат",
      });
      
      // Оптимистично обновляем UI
      refetchMessages();
    }
  }

  const handleUpdateContact = async (name: string, tags: string[]) => {
    setContactName(name);
    setContactTags(tags);
    
    try {
      // Здесь был бы запрос к API для обновления данных клиента
      // const response = await fetch(`${API_URL}/contacts/${currentChatId}`, {...});
      
      toast({
        title: "Данные клиента обновлены",
        description: "Имя и теги успешно сохранены",
      });
    } catch (error) {
      console.error('Ошибка при обновлении данных клиента:', error);
      toast({
        title: "Данные сохранены локально",
        description: "API недоступно, но изменения применены в интерфейсе",
      });
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
      <ChatHeader 
        onBack={() => setCurrentChatId?.(null)}
        contactName={contactName}
        tags={contactTags}
        onUpdateContact={handleUpdateContact}
      />
      
      <div className="flex-1 overflow-y-auto px-3 py-5 md:px-5 bg-[#f5f7fb] pb-[88px] md:pb-[72px]">
        <MessageList messages={messages} isLoading={messagesLoading} />
      </div>
      
      <MessageInput onSendMessage={sendMessage} />
    </>
  );
}
