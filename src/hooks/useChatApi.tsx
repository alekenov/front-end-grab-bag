
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
        const response = await fetch(`${CHAT_API_URL}/chats`, {
          headers: {
            'Authorization': `Bearer ${supabase.auth.session()?.access_token || ''}`,
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
        console.error('Error fetching chats via API:', error);
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
          const response = await fetch(`${CHAT_API_URL}/messages?chatId=${chatId}`, {
            headers: {
              'Authorization': `Bearer ${supabase.auth.session()?.access_token || ''}`,
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
          console.error('Error fetching messages via API:', error);
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
      const response = await fetch(`${CHAT_API_URL}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabase.auth.session()?.access_token || ''}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chatId, content, product })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Не удалось отправить сообщение");
      }
      
      return response.json();
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
      // Используем напрямую Supabase клиент, т.к. для этой операции нет отдельного API
      const { error } = await supabase
        .from('chats')
        .update({ ai_enabled: enabled })
        .eq('id', chatId);
        
      if (error) throw error;
      return { chatId, enabled };
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
