
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ChatList } from "./ChatList";
import { TabType } from "@/pages/Index";

interface ChatSidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
}

export function ChatSidebar({ activeTab, setActiveTab, currentChatId, setCurrentChatId }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-full md:w-80 bg-white flex flex-col h-full">
      <div className="p-4 border-b border-[#e1e4e8]">
        <h1 className="text-xl font-semibold text-[#1a73e8]">WhatsApp AI</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="w-full">
        <TabsList className="w-full grid grid-cols-3 border-b border-[#e1e4e8] rounded-none bg-transparent h-auto">
          <TabsTrigger 
            value="chat" 
            className="data-[state=active]:text-[#1a73e8] data-[state=active]:border-b-2 data-[state=active]:border-[#1a73e8] py-2 rounded-none text-sm"
          >
            Чаты
          </TabsTrigger>
          <TabsTrigger 
            value="datasources" 
            className="data-[state=active]:text-[#1a73e8] data-[state=active]:border-b-2 data-[state=active]:border-[#1a73e8] py-2 rounded-none text-sm"
          >
            База знаний
          </TabsTrigger>
          <TabsTrigger 
            value="examples" 
            className="data-[state=active]:text-[#1a73e8] data-[state=active]:border-b-2 data-[state=active]:border-[#1a73e8] py-2 rounded-none text-sm"
          >
            Примеры
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex-1 overflow-y-auto">
        {activeTab === "chat" && (
          <>
            <div className="p-2 sticky top-0 bg-white z-10">
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
          </>
        )}
      </div>
    </div>
  );
}
