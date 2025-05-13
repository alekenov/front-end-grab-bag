
import { formatRelativeTime } from "@/utils/dateFormatters";
import { Badge } from "@/components/ui/badge";
import { Chat, Tag } from "@/types/chat";
import { Tag as TagComponent } from "@/components/ui/tag";
import { useEffect, useState } from "react";

// Иконки для разных источников чатов
import { MessageSquare, MessagesSquare, Phone, BellDot, Clock } from "lucide-react";

interface ChatListItemProps {
  chat: Chat;
  isActive?: boolean;
  onSelectChat: (id: string) => void;
  onToggleAI?: (chatId: string, enabled: boolean) => Promise<any>;
}

export function ChatListItem({ chat, isActive = false, onSelectChat, onToggleAI }: ChatListItemProps) {
  const [lastMessage, setLastMessage] = useState<string>("");
  const [isRecentlyActive, setIsRecentlyActive] = useState(false);
  
  // Переформатируем lastMessage при изменении chat
  useEffect(() => {
    // Определяем текст последнего сообщения
    if (!chat.lastMessage) {
      setLastMessage("");
      return;
    }
    
    // Проверяем, содержит ли последнее сообщение товар
    if (chat.lastMessage.hasProduct) {
      setLastMessage(`Букет за ${chat.lastMessage.price ? chat.lastMessage.price.toLocaleString() + " ₸" : ""}`);
    } else {
      setLastMessage(chat.lastMessage.content);
    }

    // Проверяем, было ли последнее сообщение недавно
    if (chat.lastMessage.timestamp) {
      const lastMessageTime = new Date(chat.lastMessage.timestamp).getTime();
      const now = new Date().getTime();
      const timeDiff = now - lastMessageTime;
      
      // Если сообщение было получено за последние 30 минут
      if (timeDiff < 30 * 60 * 1000) {
        setIsRecentlyActive(true);
        
        // Устанавливаем таймер для сброса статуса активности
        const timer = setTimeout(() => {
          setIsRecentlyActive(false);
        }, 30 * 60 * 1000 - timeDiff);
        
        return () => clearTimeout(timer);
      }
    }
  }, [chat]);
  
  // Определяем иконку в зависимости от источника
  const getSourceIcon = () => {
    switch (chat.source?.toLowerCase()) {
      case 'whatsapp':
        return <MessagesSquare size={14} className="text-green-500" />;
      case 'telegram':
        return <MessageSquare size={14} className="text-blue-500" />;
      case 'phone':
        return <Phone size={14} className="text-purple-500" />;
      default:
        return <MessageSquare size={14} className="text-gray-500" />;
    }
  };

  // Функция для извлечения инициалов из имени чата
  const getChatInitial = () => {
    const name = chat.name || "";
    
    // Если это WhatsApp чат, показываем значок WhatsApp
    if (chat.source?.toLowerCase() === 'whatsapp') {
      return (
        <div className="bg-green-500 h-full w-full flex items-center justify-center">
          <MessagesSquare className="text-white" size={20} />
        </div>
      );
    }
    
    // В противном случае возвращаем первую букву имени
    return name.charAt(0).toUpperCase();
  };

  return (
    <div
      className={`p-3 cursor-pointer hover:bg-gray-50 flex items-center gap-3 border-b border-[#e1e4e8] transition-colors ${
        isActive ? "bg-[#e8f0fe]" : ""
      }`}
      onClick={() => onSelectChat(chat.id)}
    >
      <div className="relative h-12 w-12 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-medium text-lg shrink-0">
        {getChatInitial()}
        
        {/* Индикатор активности чата */}
        {isRecentlyActive && (
          <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-green-500 border-2 border-white">
            <Clock size={10} className="text-white" />
          </span>
        )}
        
        {/* Индикатор AI */}
        {chat.aiEnabled && (
          <span className="absolute -bottom-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-blue-600 border-2 border-white text-[10px]">
            AI
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {getSourceIcon()}
            <span className="font-medium truncate">{chat.name}</span>
          </div>
          {chat.lastMessage?.timestamp && (
            <span className="text-xs text-gray-500">
              {formatRelativeTime(chat.lastMessage.timestamp)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className={`text-sm truncate max-w-[190px] ${chat.unreadCount ? "font-medium text-black" : "text-gray-600"}`}>
            {lastMessage}
          </span>
          {chat.unreadCount ? (
            <Badge
              variant="default"
              className="ml-auto bg-[#1a73e8] text-[10px] h-5 min-w-5 flex items-center justify-center rounded-full px-1.5"
            >
              {chat.unreadCount}
              {chat.unreadCount > 0 && chat.unreadCount < 10 && (
                <BellDot size={10} className="ml-0.5 text-white" />
              )}
            </Badge>
          ) : null}
        </div>
        {/* Теги чата */}
        {chat.tags && chat.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {chat.tags.slice(0, 3).map((tag) => (
              <TagComponent key={tag.id} color={tag.color} className="px-1.5 py-0 text-[10px]">
                {tag.name}
              </TagComponent>
            ))}
            {chat.tags.length > 3 && (
              <span className="text-[10px] text-gray-500">+{chat.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
