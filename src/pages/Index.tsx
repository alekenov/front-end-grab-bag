
import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ChatList } from "@/components/chat/ChatList";
import { ChatView } from "@/components/chat/ChatView";
import { DataSourcesTab } from "@/components/datasources/DataSourcesTab";
import { ExamplesTab } from "@/components/examples/ExamplesTab";
import { Input } from "@/components/ui/input";
import { MobileTabBar } from "@/components/navigation/MobileTabBar";
import { useLocation, useSearchParams } from "react-router-dom";

export type TabType = "chat" | "datasources" | "examples";

/**
 * Функция для нормализации ID чата
 * Преобразует строковые значения к единому формату
 */
const normalizeChatId = (chatId: string | null): string | null => {
  if (!chatId) return null;
  return chatId;
};

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Проверяем наличие параметра chatId в URL или сохраненный ID в localStorage
  useEffect(() => {
    // Сначала проверяем URL-параметр chatId
    const chatIdFromUrl = searchParams.get("chatId");
    
    if (chatIdFromUrl) {
      console.log("Установка ID чата из URL:", chatIdFromUrl);
      setCurrentChatId(normalizeChatId(chatIdFromUrl));
      return;
    }
    
    // Если в URL нет параметра, проверяем localStorage
    const savedChatId = localStorage.getItem("current_chat_id");
    if (savedChatId) {
      console.log("Установка ID чата из localStorage:", savedChatId);
      setCurrentChatId(normalizeChatId(savedChatId));
      // Очищаем localStorage, так как ID уже использован
      localStorage.removeItem("current_chat_id");
    }
  }, [searchParams, location.search]); // Добавляем зависимость от location.search для реакции на изменение URL

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
              <ChatView 
                currentChatId={currentChatId} 
                setCurrentChatId={setCurrentChatId} 
              />
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
