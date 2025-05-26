
import { useMemo } from "react";
import { MessageGroup } from "./MessageGroup";
import { Message, MessagesByDate } from "@/types/chat";
import { formatDate } from "@/utils/dateFormatters";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading = false }: MessageListProps) {
  // Подробное логирование для отладки
  console.log("[MessageList] Received messages:", messages);
  console.log("[MessageList] Is loading:", isLoading);
  
  // Группируем сообщения по дате
  const messagesByDate = useMemo(() => {
    // Убедимся, что messages всегда массив
    const safeMessages = Array.isArray(messages) ? messages : [];
    
    if (safeMessages.length === 0) {
      console.log("[MessageList] No messages or empty array");
      return {};
    }
    
    const grouped: MessagesByDate = {};
    
    safeMessages.forEach((message) => {
      // Проверка наличия сообщения и временной метки
      if (!message) {
        console.warn('[MessageList] Message is undefined or null');
        return;
      }
      
      if (!message.timestamp) {
        console.warn('[MessageList] Message has no timestamp:', message);
        // Используем текущую дату для сообщений без временной метки
        message.timestamp = new Date().toISOString();
      }
      
      try {
        const date = formatDate(message.timestamp);
        if (!grouped[date]) {
          grouped[date] = [];
        }
        grouped[date].push(message);
      } catch (error) {
        console.error('[MessageList] Error formatting message date:', error, message);
      }
    });
    
    console.log("[MessageList] Grouped messages:", grouped);
    return grouped;
  }, [messages]);
  
  // Отображение состояния загрузки
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-t-[#1a73e8] border-r-[#1a73e8] border-b-[#1a73e8] border-l-transparent rounded-full animate-spin mb-3"></div>
          <div className="text-gray-500">Загрузка сообщений...</div>
        </div>
      </div>
    );
  }
  
  // Проверка наличия сообщений
  const safeMessages = Array.isArray(messages) ? messages : [];
  
  if (safeMessages.length === 0) {
    return (
      <div className="text-center text-gray-500 py-16 min-h-[300px] flex items-center justify-center">
        <div>Начните общение с клиентом!</div>
      </div>
    );
  }
  
  // Проверка наличия сгруппированных сообщений
  const messagesByDateEntries = Object.entries(messagesByDate);
  if (messagesByDateEntries.length === 0) {
    return (
      <div className="text-center text-gray-500 py-16 min-h-[300px] flex items-center justify-center">
        <div>Ошибка форматирования сообщений. Пожалуйста, обновите страницу.</div>
      </div>
    );
  }
  
  // Отображаем сгруппированные сообщения
  return (
    <div className="flex flex-col space-y-6 pb-10">
      {messagesByDateEntries.map(([date, dateMessages]) => (
        <MessageGroup key={date} date={date} messages={dateMessages || []} />
      ))}
    </div>
  );
}
