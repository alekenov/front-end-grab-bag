
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatView } from "@/components/chat/ChatView";
import { DataSourcesTab } from "@/components/datasources/DataSourcesTab";
import { ExamplesTab } from "@/components/examples/ExamplesTab";
import { Toaster } from "@/components/ui/toaster";

export type TabType = "chat" | "datasources" | "examples";

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  return (
    <div className="h-screen flex overflow-hidden">
      <ChatSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        currentChatId={currentChatId}
        setCurrentChatId={setCurrentChatId}
      />
      <main className="flex-1 flex flex-col overflow-hidden bg-[#f5f7fb]">
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as TabType)}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden data-[state=active]:flex">
            <ChatView 
              currentChatId={currentChatId} 
            />
          </TabsContent>
          <TabsContent value="datasources" className="flex-1 data-[state=active]:flex">
            <DataSourcesTab />
          </TabsContent>
          <TabsContent value="examples" className="flex-1 data-[state=active]:flex">
            <ExamplesTab />
          </TabsContent>
        </Tabs>
        <Toaster />
      </main>
    </div>
  );
}
