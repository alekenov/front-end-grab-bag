
import { useMemo } from "react";

interface Message {
  id: string;
  content: string;
  role: "USER" | "BOT";
  timestamp: string;
}

interface MessageListProps {
  messages: Message[];
}

interface MessagesByDate {
  [date: string]: Message[];
}

export function MessageList({ messages }: MessageListProps) {
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
  
  if (messages.length === 0) {
    return <div className="text-center text-gray-500">Нет сообщений</div>;
  }

  return (
    <div className="flex flex-col">
      {Object.entries(messagesByDate).map(([date, dateMessages]) => (
        <div key={date} className="mb-5">
          <div className="text-center text-xs text-gray-500 mb-3">{date}</div>
          <div className="space-y-4">
            {dateMessages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col max-w-[80%] ${
                  msg.role === 'USER' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div className={`px-4 py-3 rounded-xl relative ${
                  msg.role === 'USER' 
                    ? 'bg-[#1a73e8] text-white rounded-br-sm' 
                    : 'bg-white text-gray-800 rounded-bl-sm'
                }`}>
                  {formatMessageContent(msg.content)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Сегодня';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Вчера';
  } else {
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function formatMessageContent(content: string): React.ReactNode {
  // Replace URLs with actual links
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = content.split(urlRegex);
  
  return (
    <>
      {parts.map((part, i) => {
        if (part.match(urlRegex)) {
          return (
            <a 
              key={i} 
              href={part} 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline"
            >
              {part}
            </a>
          );
        }
        // Replace newlines with <br />
        return part.split('\n').map((line, j) => (
          <span key={`${i}-${j}`}>
            {line}
            {j < part.split('\n').length - 1 && <br />}
          </span>
        ));
      })}
    </>
  );
}
