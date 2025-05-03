
import { formatMessageTime } from "@/utils/dateFormatters";
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "USER";
  const time = message.timestamp ? formatMessageTime(message.timestamp) : "--:--";
  
  return (
    <div className={cn(
      "flex mb-2 last:mb-0",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "px-4 py-3 rounded-lg max-w-[80%] relative group",
        isUser 
          ? "bg-[#e1f5fe] text-gray-800 rounded-tr-none" 
          : "bg-white text-gray-800 rounded-tl-none shadow-sm"
      )}>
        {message.product && (
          <div className="mb-2 p-2 bg-white rounded border border-gray-200">
            <div className="flex items-center">
              {message.product.imageUrl && (
                <img 
                  src={message.product.imageUrl} 
                  alt="Товар" 
                  className="w-12 h-12 object-cover rounded mr-3"
                />
              )}
              <div>
                <div className="font-medium">Букет</div>
                <div className="text-[#1a73e8]">
                  {message.product.price.toLocaleString()} ₸
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="whitespace-pre-wrap break-words">
          {message.content}
        </div>
        
        <div className={cn(
          "text-xs text-gray-500 mt-1 text-right",
          isUser ? "text-right" : "text-left"
        )}>
          {time}
        </div>
      </div>
    </div>
  );
}
