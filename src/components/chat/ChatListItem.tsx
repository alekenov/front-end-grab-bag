
import { formatRelativeTime } from "@/utils/dateFormatters";
import { Badge } from "@/components/ui/badge";
import { Chat } from "@/types/chat";
import { Link } from "react-router-dom";

interface ChatListItemProps {
  chat: Chat;
  isActive?: boolean;
  onSelectChat: (id: string) => void;
}

export function ChatListItem({ chat, isActive = false, onSelectChat }: ChatListItemProps) {
  // Определяем текст последнего сообщения
  const lastMessageContent = () => {
    if (!chat.lastMessage) return "";
    
    // Проверяем, содержит ли последнее сообщение товар
    if (chat.lastMessage.hasProduct) {
      return `Товар: ${chat.lastMessage.price ? chat.lastMessage.price + " ₸" : ""}`;
    }
    
    return chat.lastMessage.content;
  };

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
            {lastMessageContent()}
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
