
import { MessageBubble } from "./MessageBubble";
import { Message } from "@/types/chat";
import { useIsMobile } from "@/hooks/use-mobile";

interface MessageGroupProps {
  date: string;
  messages: Message[];
}

export function MessageGroup({ date, messages }: MessageGroupProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4">
      <div className="text-center">
        <span className="text-xs bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-gray-500 shadow-sm">
          {date}
        </span>
      </div>
      <div className="space-y-3">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}
