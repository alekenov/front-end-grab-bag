
import { useState } from "react";
import { ChatList } from "@/components/chat/ChatList";
import { ChatView } from "@/components/chat/ChatView";
import { Input } from "@/components/ui/input";
import { AppLayout } from "@/components/layout/AppLayout";

export default function ChatsPage() {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AppLayout title="Чаты" activePage="chats">
      <div className="flex-1 flex flex-col overflow-hidden bg-[#f5f7fb]">
        {!currentChatId ? (
          <div className="flex-1 flex flex-col">
            <div className="sticky top-0 z-10 p-4 bg-white border-b border-[#e1e4e8]">
              <h1 className="text-xl font-semibold text-[#1a73e8] mb-4">WhatsApp AI</h1>
              <Input
                placeholder="Поиск чатов..."
                className="h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <ChatList 
              searchQuery={searchQuery}
              currentChatId={currentChatId}
              setCurrentChatId={setCurrentChatId}
            />
          </div>
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
