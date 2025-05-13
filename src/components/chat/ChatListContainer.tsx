
import { useState } from "react";
import { ChatList } from "@/components/chat/ChatList";
import { ChatSearch } from "@/components/chat/ChatSearch";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatListContainerProps {
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
}

export function ChatListContainer({ currentChatId, setCurrentChatId }: ChatListContainerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="flex flex-col h-full w-full">
      <ChatSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex-1 overflow-y-auto">
        <ChatList 
          searchQuery={searchQuery}
          currentChatId={currentChatId}
          setCurrentChatId={setCurrentChatId}
        />
      </div>
    </div>
  );
}
