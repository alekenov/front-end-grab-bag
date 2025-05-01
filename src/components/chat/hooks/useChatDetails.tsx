
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Chat, SupabaseChat } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";

export function useChatDetails(currentChatId: string | null) {
  const [chatName, setChatName] = useState("");
  
  // Fetch chat details
  const { data: chatDetails, error: chatError } = useQuery({
    queryKey: ['chat', currentChatId],
    queryFn: async () => {
      if (!currentChatId) return null;
      
      try {
        const { data, error } = await supabase
          .from('chats')
          .select('*')
          .eq('id', currentChatId)
          .single();
          
        if (error) {
          console.error('Error fetching chat details:', error);
          throw error;
        }
        
        // Convert Supabase data to our app format
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
      } catch (error) {
        console.error('Error in chat details query:', error);
        return null;
      }
    },
    enabled: !!currentChatId
  });

  useEffect(() => {
    if (chatDetails) {
      setChatName(chatDetails.name || "");
    }
  }, [chatDetails]);

  return {
    chatDetails,
    chatName,
    setChatName,
    chatError
  };
}
