
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatView } from "@/components/chat/ChatView";
import { DataSourcesTab } from "@/components/datasources/DataSourcesTab";
import { ExamplesTab } from "@/components/examples/ExamplesTab";
import { Toaster } from "@/components/ui/toaster";
import { MobileTabBar } from "@/components/navigation/MobileTabBar";

export type TabType = "chat" | "datasources" | "examples";

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <ChatSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentChatId={currentChatId}
          setCurrentChatId={setCurrentChatId}
        />
      </div>

      <main className="flex-1 flex flex-col overflow-hidden bg-[#f5f7fb] pb-14 md:pb-0">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabType)}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsContent value="chat">
            <ChatView currentChatId={currentChatId} />
          </TabsContent>
          <TabsContent value="datasources">
            <DataSourcesTab />
          </TabsContent>
          <TabsContent value="examples">
            <ExamplesTab />
          </TabsContent>
        </Tabs>
        <MobileTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
        <Toaster />
      </main>
    </div>
  );
}
