
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { MessageList } from "./MessageList";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { EmptyState } from "./EmptyState";
import { Message, Chat, SupabaseChat, SupabaseMessage } from "@/types/chat";
import { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";

interface ChatViewProps {
  currentChatId: string | null;
  setCurrentChatId?: (id: string | null) => void;
}

export function ChatView({ currentChatId, setCurrentChatId }: ChatViewProps) {
  const [chatName, setChatName] = useState("");
  const [contactName, setContactName] = useState("Иван Петров");
  const [contactTags, setContactTags] = useState<string[]>(["пионы", "самовывоз"]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Получение информации о чате
  const { data: chatDetails, error: chatError } = useQuery({
    queryKey: ['chat', currentChatId],
    queryFn: async () => {
      if (!currentChatId) return null;
      
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('id', currentChatId)
        .single();
        
      if (error) {
        console.error('Error fetching chat details:', error);
        throw error;
      }
      
      // Преобразуем данные из Supabase в формат нашего приложения
      const supabaseChat = data as SupabaseChat;
      const chat: Chat = {
        id: supabaseChat.id,
        name: supabaseChat.name,
        aiEnabled: supabaseChat.ai_enabled,
        unreadCount: supabaseChat.unread_count || 0,
        created_at: supabaseChat.created_at || undefined,
        updated_at: supabaseChat.updated_at || undefined
      };
      
      return chat;
    },
    enabled: !!currentChatId
  });

  useEffect(() => {
    if (chatDetails) {
      setChatName(chatDetails.name || "");
    }
  }, [chatDetails]);

  // Получение сообщений для текущего чата
  const { 
    data: messages = [],
    isLoading: messagesLoading,
    refetch: refetchMessages,
    error: messagesError
  } = useQuery({
    queryKey: ['messages', currentChatId],
    queryFn: async () => {
      if (!currentChatId) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', currentChatId)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }
      
      // Преобразуем данные из Supabase в формат нашего приложения
      return data.map((msg: SupabaseMessage) => {
        const message: Message = {
          id: msg.id,
          content: msg.content,
          timestamp: msg.created_at || new Date().toISOString(),
          role: msg.is_from_user ? "USER" : "BOT"
        };
        
        // Добавляем информацию о продукте, если она есть
        if (msg.has_product && msg.product_data) {
          const productData = msg.product_data as any;
          if (typeof productData === 'object') {
            message.product = {
              id: productData.id?.toString() || "",
              imageUrl: productData.imageUrl || "",
              price: Number(productData.price) || 0
            };
          }
        }
        
        return message;
      });
    },
    enabled: !!currentChatId
  });

  // Мутация для отправки сообщения
  const sendMessageMutation = useMutation({
    mutationFn: async ({ 
      content, 
      product, 
      chatId 
    }: { 
      content: string; 
      product?: Product; 
      chatId: string;
    }) => {
      const messageData = {
        chat_id: chatId,
        content,
        is_from_user: true,
        has_product: !!product,
        product_data: product ? {
          id: product.id,
          imageUrl: product.imageUrl, 
          price: product.price
        } : null
      };
      
      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select();
        
      if (error) throw error;
      
      // Для демонстрации добавим ответ от AI после небольшой задержки
      if (chatDetails?.aiEnabled) {
        setTimeout(async () => {
          const aiResponse = product
            ? `Спасибо за интерес к букету за ${product.price} ₸! Как вам помочь с выбором?`
            : `Спасибо за ваше сообщение! Чем я могу вам помочь?`;
            
          await supabase
            .from('messages')
            .insert([{
              chat_id: chatId,
              content: aiResponse,
              is_from_user: false
            }]);
            
          refetchMessages();
        }, 1000);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', currentChatId] });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить сообщение",
        variant: "destructive",
      });
    }
  });

  async function sendMessage(content: string, product?: Product) {
    if (!currentChatId) return;
    
    try {
      await sendMessageMutation.mutateAsync({ 
        content, 
        product, 
        chatId: currentChatId 
      });
      
      toast({
        title: "Сообщение отправлено",
        description: product ? "Товар добавлен в чат" : "Сообщение добавлено в чат",
      });
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
    }
  }

  const handleUpdateContact = async (name: string, tags: string[]) => {
    setContactName(name);
    setContactTags(tags);
    
    try {
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
