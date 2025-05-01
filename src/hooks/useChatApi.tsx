
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Message, Chat } from "@/types/chat";
import { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";

// URL Edge Function API
const CHAT_API_URL = "https://dkohweivbdwweyvyvcbc.supabase.co/functions/v1/chat-api";

export function useChatApi() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Получение списка чатов
  const { 
    data: chats = [], 
    isLoading: isLoadingChats,
    error: chatsError,
    refetch: refetchChats
  } = useQuery({
    queryKey: ['chats-api'],
    queryFn: async () => {
      try {
        // Получаем текущую сессию
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData?.session?.access_token || '';
        
        // Сначала пробуем получить чаты напрямую из Supabase
        const { data: supabaseChats, error: supabaseError } = await supabase
          .from('chats')
          .select('*')
          .order('updated_at', { ascending: false });
          
        if (!supabaseError && supabaseChats) {
          console.log('Получено чатов из Supabase:', supabaseChats.length);
          
          // Получаем последние сообщения для каждого чата
          const chatsWithMessages = await Promise.all(
            supabaseChats.map(async (chat) => {
              const { data: messages } = await supabase
                .from('messages')
                .select('content, created_at')
                .eq('chat_id', chat.id)
                .order('created_at', { ascending: false })
                .limit(1);
                
              return {
                id: chat.id,
                name: chat.name,
                aiEnabled: chat.ai_enabled,
                unreadCount: chat.unread_count || 0,
                lastMessage: messages && messages.length > 0 ? {
                  content: messages[0].content || "",
                  timestamp: messages[0].created_at || ""
                } : undefined,
                created_at: chat.created_at,
                updated_at: chat.updated_at
              };
            })
          );
          
          return chatsWithMessages;
        }
        
        // Если не получилось из Supabase, пробуем через Edge Function
        console.log('Trying to fetch chats via Edge Function API');
        
        const response = await fetch(`${CHAT_API_URL}/chats`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Не удалось загрузить список чатов");
        }
        
        const data = await response.json();
        return data.chats || [];
      } catch (error) {
        console.error('Error fetching chats:', error);
        throw error;
      }
    }
  });

  // Получение сообщений для конкретного чата
  const getMessages = (chatId: string | null) => {
    return useQuery({
      queryKey: ['messages-api', chatId],
      queryFn: async () => {
        if (!chatId) return [];
        
        try {
          console.log('Fetching messages for chat ID:', chatId);
          
          // Сначала пробуем получить сообщения напрямую из Supabase
          const { data: supabaseMessages, error: supabaseError } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: true });
            
          if (!supabaseError && supabaseMessages) {
            console.log('Получено сообщений из Supabase:', supabaseMessages.length);
            
            return supabaseMessages.map(msg => ({
              id: msg.id,
              content: msg.content || "",
              role: msg.is_from_user ? "USER" : "BOT",
              timestamp: msg.created_at || new Date().toISOString(),
              product: msg.has_product && msg.product_data ? {
                id: String(msg.product_data.id || ""),
                imageUrl: msg.product_data.imageUrl || "",
                price: Number(msg.product_data.price) || 0
              } : undefined
            }));
          }
          
          // Если не получилось из Supabase, пробуем через Edge Function
          console.log('Trying to fetch messages via Edge Function API');
          
          // Получаем текущую сессию для Edge Function
          const { data: sessionData } = await supabase.auth.getSession();
          const accessToken = sessionData?.session?.access_token || '';
          
          const response = await fetch(`${CHAT_API_URL}/messages?chatId=${chatId}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Не удалось загрузить сообщения");
          }
          
          const data = await response.json();
          return data.messages || [];
          
        } catch (error) {
          console.error('Error fetching messages:', error);
          throw error;
        }
      },
      enabled: !!chatId
    });
  };

  // Отправка сообщения
  const sendMessageMutation = useMutation({
    mutationFn: async ({ 
      chatId, 
      content, 
      product 
    }: { 
      chatId: string; 
      content: string; 
      product?: Product;
    }) => {
      try {
        // Сначала пробуем отправить через Supabase
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
        
        const { data: supabaseData, error: supabaseError } = await supabase
          .from('messages')
          .insert([messageData])
          .select();
          
        if (!supabaseError) {
          if (chats) {
            const chat = chats.find(c => c.id === chatId);
            if (chat?.aiEnabled) {
              // Добавляем автоматический ответ от AI
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
                  
                queryClient.invalidateQueries({ queryKey: ['messages-api', chatId] });
              }, 1000);
            }
            
            return supabaseData;
          }
        }
        
        // Если через Supabase не получилось, пробуем через Edge Function API
        console.log('Trying to send message via Edge Function API');
        
        // Получаем текущую сессию для Edge Function
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData?.session?.access_token || '';
        
        const response = await fetch(`${CHAT_API_URL}/send`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ chatId, content, product })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Не удалось отправить сообщение");
        }
        
        return response.json();
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages-api', variables.chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats-api'] });
      
      toast({
        title: "Сообщение отправлено",
        description: variables.product ? "Товар добавлен в чат" : "Сообщение добавлено в чат",
      });
    },
    onError: (error) => {
      console.error('Error sending message via API:', error);
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить сообщение",
        variant: "destructive",
      });
    }
  });

  // Функция переключения состояния AI для чата
  const toggleAIMutation = useMutation({
    mutationFn: async ({ chatId, enabled }: { chatId: string; enabled: boolean }) => {
      try {
        // Используем напрямую Supabase клиент
        const { error } = await supabase
          .from('chats')
          .update({ ai_enabled: enabled })
          .eq('id', chatId);
          
        if (error) throw error;
        return { chatId, enabled };
      } catch (error) {
        console.error('Error toggling AI:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['chats-api'] });
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

  return {
    chats,
    isLoadingChats,
    chatsError,
    refetchChats,
    getMessages,
    sendMessage: (chatId: string, content: string, product?: Product) => 
      sendMessageMutation.mutateAsync({ chatId, content, product }),
    toggleAI: (chatId: string, enabled: boolean) => 
      toggleAIMutation.mutateAsync({ chatId, enabled }),
  };
}
