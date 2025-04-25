
import { useState } from "react";
import { TabsContent, Tabs } from "@/components/ui/tabs";
import { DataSourcesTab } from "@/components/datasources/DataSourcesTab";
import { ExamplesTab } from "@/components/examples/ExamplesTab";
import { AppLayout } from "@/components/layout/AppLayout";

type KnowledgeTabType = "datasources" | "examples";

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState<KnowledgeTabType>("datasources");

  return (
    <AppLayout title="База знаний" activePage="knowledge">
      <div className="flex-1 flex flex-col overflow-hidden bg-[#f5f7fb]">
        <div className="sticky top-0 z-10 p-4 bg-white border-b border-[#e1e4e8] flex gap-4">
          <button
            onClick={() => setActiveTab("datasources")}
            className={`text-base font-medium pb-1 ${
              activeTab === "datasources" 
                ? "text-[#1a73e8] border-b-2 border-[#1a73e8]" 
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            База знаний
          </button>
          <button
            onClick={() => setActiveTab("examples")}
            className={`text-base font-medium pb-1 ${
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
          onValueChange={(value) => setActiveTab(value as KnowledgeTabType)}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsContent value="datasources" className="flex-1 flex flex-col">
            <DataSourcesTab />
          </TabsContent>
          <TabsContent value="examples" className="flex-1 flex flex-col">
            <ExamplesTab />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
