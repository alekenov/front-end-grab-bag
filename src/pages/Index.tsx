
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ChatList } from "@/components/chat/ChatList";
import { ChatView } from "@/components/chat/ChatView";
import { DataSourcesTab } from "@/components/datasources/DataSourcesTab";
import { ExamplesTab } from "@/components/examples/ExamplesTab";
import { Input } from "@/components/ui/input";
import { MobileTabBar } from "@/components/navigation/MobileTabBar";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export type TabType = "chat" | "datasources" | "examples";

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <main className="flex-1 flex flex-col overflow-hidden bg-[#f5f7fb] pb-14 md:pb-0">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabType)}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsContent value="chat" className="flex-1 flex flex-col">
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
              <div className="flex-1 flex flex-col">
                <div className="sticky top-0 z-10 p-4 bg-white border-b border-[#e1e4e8]">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mb-2"
                    onClick={() => setCurrentChatId(null)}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Назад к списку
                  </Button>
                </div>
                <ChatView 
                  currentChatId={currentChatId} 
                  setCurrentChatId={setCurrentChatId} 
                />
              </div>
            )}
          </TabsContent>
          <TabsContent value="datasources">
            <DataSourcesTab />
          </TabsContent>
          <TabsContent value="examples">
            <ExamplesTab />
          </TabsContent>
        </Tabs>
        <MobileTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
    </div>
  );
}
