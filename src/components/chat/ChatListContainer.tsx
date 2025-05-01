
import { useState } from "react";
import { ChatList } from "@/components/chat/ChatList";
import { ChatSearch } from "@/components/chat/ChatSearch";

interface ChatListContainerProps {
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
}

export function ChatListContainer({ currentChatId, setCurrentChatId }: ChatListContainerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="flex-1 flex flex-col">
      <ChatSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <ChatList 
        searchQuery={searchQuery}
        currentChatId={currentChatId}
        setCurrentChatId={setCurrentChatId}
      />
    </div>
  );
}
