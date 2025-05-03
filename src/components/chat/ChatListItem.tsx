
import { formatRelativeTime } from "@/utils/dateFormatters";
import { Badge } from "@/components/ui/badge";
import { Chat } from "@/types/chat";
import { useEffect, useState } from "react";

interface ChatListItemProps {
  chat: Chat;
  isActive?: boolean;
  onSelectChat: (id: string) => void;
  onToggleAI?: (chatId: string, enabled: boolean) => Promise<any>;
}

export function ChatListItem({ chat, isActive = false, onSelectChat, onToggleAI }: ChatListItemProps) {
  const [lastMessage, setLastMessage] = useState<string>("");
  
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
  }, [chat]);

  return (
    <div
      className={`p-3 cursor-pointer hover:bg-gray-50 flex items-center gap-3 border-b border-[#e1e4e8] transition-colors ${
        isActive ? "bg-[#e8f0fe]" : ""
      }`}
      onClick={() => onSelectChat(chat.id)}
    >
      <div className="h-12 w-12 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-medium text-lg shrink-0">
        {chat.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-medium truncate">{chat.name}</span>
          {chat.lastMessage?.timestamp && (
            <span className="text-xs text-gray-500">
              {formatRelativeTime(chat.lastMessage.timestamp)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm text-gray-600 truncate max-w-[190px]">
            {lastMessage}
          </span>
          {chat.unreadCount ? (
            <Badge
              variant="default"
              className="ml-auto bg-[#1a73e8] text-[10px] h-5 min-w-5 flex items-center justify-center rounded-full px-1.5"
            >
              {chat.unreadCount}
            </Badge>
          ) : null}
        </div>
      </div>
    </div>
  );
}
