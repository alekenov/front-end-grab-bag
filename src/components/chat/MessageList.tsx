
import { useMemo } from "react";
import { MessageGroup } from "./MessageGroup";
import { Message, MessagesByDate } from "@/types/chat";
import { formatDate } from "@/utils/dateFormatters";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading = false }: MessageListProps) {
  // Group messages by date
  const messagesByDate = useMemo(() => {
    const grouped: MessagesByDate = {};
    
    messages.forEach((message) => {
      const date = formatDate(message.timestamp);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });
    
    return grouped;
  }, [messages]);
  
  if (isLoading) {
    return <div className="text-center text-gray-500">Загрузка сообщений...</div>;
  }
  
  if (messages.length === 0) {
    return <div className="text-center text-gray-500">Нет сообщений</div>;
  }

  return (
    <div className="flex flex-col space-y-5">
      {Object.entries(messagesByDate).map(([date, dateMessages]) => (
        <MessageGroup key={date} date={date} messages={dateMessages} />
      ))}
    </div>
  );
}
