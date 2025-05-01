
import { useState } from "react";
import { ChatListContainer } from "@/components/chat/ChatListContainer";
import { ChatView } from "@/components/chat/ChatView";
import { AppLayout } from "@/components/layout/AppLayout";

export default function ChatsPage() {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  return (
    <AppLayout title="Чаты" activePage="chats">
      <div className="flex-1 flex flex-col overflow-hidden bg-[#f5f7fb]">
        {!currentChatId ? (
          <ChatListContainer 
            currentChatId={currentChatId}
            setCurrentChatId={setCurrentChatId}
          />
        ) : (
          <ChatView 
            currentChatId={currentChatId} 
            setCurrentChatId={setCurrentChatId} 
          />
        )}
      </div>
    </AppLayout>
  );
}
