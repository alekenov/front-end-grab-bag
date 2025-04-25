
import { Switch } from "@/components/ui/switch";
import { Chat } from "@/types/chat";
import { formatTime } from "@/utils/dateFormatters";

interface ChatListItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect: (id: string) => void;
  onToggleAI: (chatId: string, enabled: boolean) => void;
}

export function ChatListItem({ chat, isActive, onSelect, onToggleAI }: ChatListItemProps) {
  const handleToggleAI = (e: React.MouseEvent, checked: boolean) => {
    e.stopPropagation();
    onToggleAI(chat.id, checked);
  };

  return (
    <li
      className={`p-3 border-b border-[#f0f2f7] flex justify-between cursor-pointer transition-colors ${
        isActive ? "bg-[#e8f0fe]" : "hover:bg-[#f5f7fb] active:bg-[#f0f2f7]"
      }`}
      onClick={() => onSelect(chat.id)}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-medium text-sm truncate">
            {chat.name}
          </span>
          {chat.unreadCount && chat.unreadCount > 0 && (
            <span className="shrink-0 bg-[#1a73e8] text-white text-xs font-medium px-1.5 py-0.5 rounded-full leading-none">
              {chat.unreadCount}
            </span>
          )}
        </div>
        <span className="block text-xs text-gray-600 truncate">
          {chat.lastMessage ? chat.lastMessage.content : "Нет сообщений"}
        </span>
      </div>
      <div className="flex flex-col items-end ml-2.5 min-w-[60px]">
        <span className="text-xs text-gray-500 mb-1">
          {chat.lastMessage ? formatTime(chat.lastMessage.timestamp) : ""}
        </span>
        <Switch 
          checked={chat.aiEnabled} 
          onCheckedChange={(checked) => {
            handleToggleAI(event as unknown as React.MouseEvent, checked);
          }}
          className="h-4 w-7 data-[state=checked]:bg-[#1a73e8]"
        />
      </div>
    </li>
  );
}
