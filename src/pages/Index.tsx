
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatView } from "@/components/chat/ChatView";
import { DataSourcesTab } from "@/components/datasources/DataSourcesTab";
import { ExamplesTab } from "@/components/examples/ExamplesTab";
import { Toaster } from "@/components/ui/toaster";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export type TabType = "chat" | "datasources" | "examples";

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Mobile Sidebar Trigger */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80">
            <ChatSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              currentChatId={currentChatId}
              setCurrentChatId={setCurrentChatId}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <ChatSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentChatId={currentChatId}
          setCurrentChatId={setCurrentChatId}
        />
      </div>

      <main className="flex-1 flex flex-col overflow-hidden bg-[#f5f7fb]">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabType)}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden data-[state=active]:flex">
            <ChatView currentChatId={currentChatId} />
          </TabsContent>
          <TabsContent value="datasources" className="flex-1 flex flex-col overflow-hidden data-[state=active]:flex">
            <DataSourcesTab />
          </TabsContent>
          <TabsContent value="examples" className="flex-1 flex flex-col overflow-hidden data-[state=active]:flex">
            <ExamplesTab />
          </TabsContent>
        </Tabs>
        <Toaster />
      </main>
    </div>
  );
}
