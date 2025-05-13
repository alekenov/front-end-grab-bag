
import { formatMessageTime } from "@/utils/dateFormatters";
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { BotIcon, User2Icon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MessageBubbleProps {
  message: Message;
  isMobile?: boolean;
}

export function MessageBubble({ message, isMobile }: MessageBubbleProps) {
  // Теперь сообщения от USER (клиента) слева, а сообщения от BOT (нас) справа
  const isFromUs = message.role === "BOT";
  const time = message.timestamp ? formatMessageTime(message.timestamp) : "--:--";
  
  return (
    <div className={cn(
      "flex mb-2 last:mb-0",
      isFromUs ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "px-4 py-3 rounded-lg relative group",
        isFromUs 
          ? "bg-[#e1f5fe] text-gray-800 rounded-tr-none max-w-[80%]" 
          : "bg-white text-gray-800 rounded-tl-none shadow-sm max-w-[80%]",
        isMobile ? "max-w-[90%]" : "max-w-[80%]"
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
        
        <div className="flex items-center justify-between mt-1">
          <div className="text-xs text-gray-500">
            {time}
          </div>
          
          {isFromUs && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    {message.sender === "AI" ? (
                      <BotIcon size={14} className="text-blue-600 ml-1" />
                    ) : (
                      <User2Icon size={14} className="text-gray-600 ml-1" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{message.sender === "AI" ? "Отправлено AI" : "Отправлено оператором"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
}
