
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
    if (!messages || messages.length === 0) {
      return {};
    }
    
    const grouped: MessagesByDate = {};
    
    messages.forEach((message) => {
      // Проверяем, что message и message.timestamp существуют
      if (!message || !message.timestamp) {
        console.warn('Message is missing or has no timestamp:', message);
        return;
      }
      
      try {
        const date = formatDate(message.timestamp);
        if (!grouped[date]) {
          grouped[date] = [];
        }
        grouped[date].push(message);
      } catch (error) {
        console.error('Error formatting message date:', error, message);
      }
    });
    
    return grouped;
  }, [messages]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-t-[#1a73e8] border-r-[#1a73e8] border-b-[#1a73e8] border-l-transparent rounded-full animate-spin mb-3"></div>
          <div className="text-gray-500">Загрузка сообщений...</div>
        </div>
      </div>
    );
  }
  
  if (!messages || messages.length === 0) {
    return <div className="text-center text-gray-500 py-6">Нет сообщений</div>;
  }

  // Логируем для отладки
  console.log("Всего сообщений:", messages.length);
  console.log("Группировка по датам:", Object.keys(messagesByDate));
  
  return (
    <div className="flex flex-col space-y-5">
      {Object.entries(messagesByDate).map(([date, dateMessages]) => (
        <MessageGroup key={date} date={date} messages={dateMessages || []} />
      ))}
    </div>
  );
}
