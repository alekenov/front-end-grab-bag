
import { formatMessageTime } from "@/utils/dateFormatters";
import { Message } from "@/types/chat";

interface MessageBubbleProps {
  message: Message;
  isMobile: boolean;
}

export function MessageBubble({ message, isMobile }: MessageBubbleProps) {
  const isUser = message.role === 'USER';
  
  // Проверяем наличие продукта
  const hasProduct = !!message.product;

  return (
    <div 
      className={`flex flex-col ${isMobile ? 'max-w-[90%]' : 'max-w-[85%] md:max-w-[75%]'} ${
        isUser ? 'ml-auto items-end' : 'mr-auto items-start'
      }`}
    >
      {/* Если есть информация о продукте, отображаем её */}
      {hasProduct && (
        <div className={`px-4 py-2.5 mb-2 rounded-lg ${
          isUser 
            ? 'bg-white text-gray-800 shadow-sm border border-gray-100' 
            : 'bg-white text-gray-800 shadow-sm border border-gray-100'
        }`}>
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              <img 
                src={message.product?.imageUrl} 
                alt="Товар" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-3">
              <p className="font-semibold">Букет</p>
              <p className="text-[#1a73e8] font-medium">{message.product?.price} ₸</p>
            </div>
          </div>
        </div>
      )}
      
      <div 
        className={`px-4 py-2.5 rounded-2xl break-words ${
          isUser 
            ? 'bg-[#1a73e8] text-white rounded-br-lg shadow-md' 
            : 'bg-white text-gray-800 rounded-bl-lg shadow-sm border border-gray-100'
        }`}
        style={{ wordBreak: 'break-word' }}
      >
        {formatMessageContent(message.content)}
      </div>
      <div className="text-[11px] text-gray-500 mt-1 px-1">
        {formatMessageTime(message.timestamp)}
      </div>
    </div>
  );
}

function formatMessageContent(content: string): React.ReactNode {
  if (!content) return ""; // Защита от undefined или null
  
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
