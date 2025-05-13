import { useEffect, useState, useCallback, useRef } from "react";
import { useChatApi } from "@/hooks/chat";
import { MessageList } from "./MessageList";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { EmptyState } from "./EmptyState";
import { Product } from "@/types/product";
import { Tag } from "@/types/chat";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ChatViewProps {
  currentChatId: string | null;
  setCurrentChatId?: (id: string | null) => void;
  currentChatTags?: Tag[];
  setCurrentChatTags?: (tags: Tag[]) => void;
}

export function ChatView({ 
  currentChatId, 
  setCurrentChatId,
  currentChatTags = [],
  setCurrentChatTags
}: ChatViewProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const chatApi = useChatApi();
  const [name, setName] = useState("");
  const [source, setSource] = useState<string | undefined>(undefined);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<Tag[]>(currentChatTags);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  // Получаем детали чата
  const {
    data: chat,
    isLoading: chatLoading,
    refetch: refetchChat
  } = currentChatId ? chatApi.getChat(currentChatId) : { data: null, isLoading: false, refetch: () => Promise.resolve() };
  
  const {
    data: messages = [],
    isLoading: messagesLoading,
    error: messagesError,
    refetch: refetchMessages,
  } = currentChatId ? chatApi.getMessages(currentChatId) : { data: [], isLoading: false, error: null, refetch: () => Promise.resolve() };
  
  // Автоскролл при новых сообщениях
  useEffect(() => {
    if (messages.length && messageEndRef.current) {
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages]);

  // Обновляем теги при изменении currentChatTags
  useEffect(() => {
    setTags(currentChatTags);
  }, [currentChatTags]);

  // Обновляем данные чата при их получении
  useEffect(() => {
    if (chat) {
      setName(chat.name || "Новый контакт");
      setSource(chat.source);
      
      // Получаем номер телефона из данных чата если доступно
      if (chat.customer && chat.customer.phone) {
        setPhoneNumber(chat.customer.phone);
      } else if (chat.phone_number) {
        setPhoneNumber(chat.phone_number);
      }
    }
  }, [chat]);
  
  // Принудительно обновляем данные при монтировании компонента
  const forceRefresh = useCallback(() => {
    if (!currentChatId) return;
    
    console.log("[ChatView] Force refreshing data for chat:", currentChatId);
    
    // Инвалидируем и обновляем данные
    queryClient.invalidateQueries({ queryKey: ['messages-api', currentChatId] });
    queryClient.invalidateQueries({ queryKey: ['chats-api'] });
    
    // Явно запрашиваем обновление данных
    setTimeout(() => {
      refetchMessages();
      chatApi.refetchChats();
      if (refetchChat) refetchChat();
    }, 100);
  }, [currentChatId, queryClient, refetchMessages, chatApi, refetchChat]);
  
  // Эффект для проверки товара в localStorage и обработка обновлений
  useEffect(() => {
    if (!currentChatId) return;
    
    console.log("[ChatView] Setting up chat view for:", currentChatId);
    
    // Форсируем обновление данных при монтировании компонента
    forceRefresh();
    
    // Проверяем наличие продукта в localStorage
    const checkForProduct = () => {
      const selectedProductJson = localStorage.getItem("selected_product");
      if (selectedProductJson && currentChatId) {
        try {
          const product = JSON.parse(selectedProductJson);
          console.log("[ChatView] Found product in localStorage:", product);
          
          // Отправляем товар в чат
          chatApi.sendMessage(
            currentChatId, 
            `Букет за ${product.price.toLocaleString()} ₸`, 
            product
          ).then(() => {
            toast({
              title: "Товар добавлен",
              description: `Букет за ${product.price.toLocaleString()} ₸ добавлен в чат`,
            });
            
            // Удаляем товар из localStorage
            localStorage.removeItem("selected_product");
            
            // Обновляем UI
            forceRefresh();
          }).catch(err => {
            console.error("[ChatView] Error sending product message:", err);
          });
        } catch (error) {
          console.error("[ChatView] Error processing selected product:", error);
        }
      }
    };
    
    // Проверяем при монтировании
    checkForProduct();
    
    // Настраиваем интервал для периодической проверки
    const intervalId = setInterval(() => {
      console.log("[ChatView] Checking for updates");
      refetchMessages();
      chatApi.refetchChats();
    }, 5000);
    
    // Очищаем интервал при размонтировании
    return () => {
      clearInterval(intervalId);
      console.log("[ChatView] Cleaning up for chat:", currentChatId);
    };
  }, [currentChatId, chatApi, refetchMessages, queryClient, forceRefresh, toast]);
  
  // Обработчик обновления контакта
  const handleUpdateContact = (name: string, newTags: string[]) => {
    setName(name);
    // Обновления тегов должно происходить через TagSelector
    console.log("[ChatView] Contact updated:", { name, tags: newTags });
  };
  
  // Обработчик изменения тегов
  const handleTagsChange = (newTags: Tag[]) => {
    setTags(newTags);
    if (setCurrentChatTags) {
      setCurrentChatTags(newTags);
    }
  };
  
  // Обработчик отправки сообщения с обработкой ошибок
  const handleSendMessage = async (content: string, product?: Product) => {
    if (!currentChatId || !content.trim()) return;
    
    try {
      await chatApi.sendMessage(currentChatId, content, product);
      
      // Обновляем список сообщений
      setTimeout(() => {
        forceRefresh();
      }, 300);
    } catch (error) {
      console.error("[ChatView] Error sending message:", error);
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить сообщение",
        variant: "destructive",
      });
    }
  };

  if (!currentChatId) {
    return <EmptyState />;
  }

  // Проверяем наличие demo в ID чата и создаем демо-сообщения если нужно
  const isDemoChat = currentChatId.startsWith('demo-');

  if (messagesError) {
    console.error('[ChatView] Messages error:', messagesError);
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        onBack={() => setCurrentChatId?.(null)}
        contactName={name || "Новый контакт"}
        tags={tags}
        source={source}
        phoneNumber={phoneNumber}
        onUpdateContact={handleUpdateContact}
      />
      
      <div className="flex-1 overflow-y-auto bg-[#f5f7fb]">
        <div className="px-4 py-6">
          <MessageList 
            messages={messages} 
            isLoading={messagesLoading && !isDemoChat} 
          />
          <div ref={messageEndRef} className="h-8" />
        </div>
      </div>
      
      <MessageInput 
        onSendMessage={handleSendMessage} 
        currentChatId={currentChatId}
      />
    </div>
  );
}
