
import { useState } from "react";
import { TabsContent, Tabs } from "@/components/ui/tabs";
import { KnowledgeBase } from "@/components/knowledge/KnowledgeBase";
import { Examples } from "@/components/knowledge/Examples";
import { AppLayout } from "@/components/layout/AppLayout";

type GuideTabType = "knowledge" | "examples";

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState<GuideTabType>("knowledge");

  return (
    <AppLayout title="Гид" activePage="guide">
      <div className="sticky top-0 z-10 p-4 bg-white border-b border-[#e1e4e8] flex gap-4">
        <button
          onClick={() => setActiveTab("knowledge")}
          className={`text-base font-medium pb-1 px-1 ${
            activeTab === "knowledge" 
              ? "text-[#1a73e8] border-b-2 border-[#1a73e8]" 
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          База знаний
        </button>
        <button
          onClick={() => setActiveTab("examples")}
          className={`text-base font-medium pb-1 px-1 ${
            activeTab === "examples" 
              ? "text-[#1a73e8] border-b-2 border-[#1a73e8]" 
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Обучающие примеры
        </button>
      </div>
      
      <Tabs 
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as GuideTabType)}
        className="flex-1 overflow-auto"
      >
        <TabsContent value="knowledge" className="mt-0 h-full">
          <KnowledgeBase />
        </TabsContent>
        <TabsContent value="examples" className="mt-0 h-full">
          <Examples />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
