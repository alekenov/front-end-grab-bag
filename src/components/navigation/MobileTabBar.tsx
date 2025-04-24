
import { Home, Search, Menu } from "lucide-react";
import { TabType } from "@/pages/Index";

interface MobileTabBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export function MobileTabBar({ activeTab, setActiveTab }: MobileTabBarProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t flex items-center justify-around px-2 z-50">
      <button
        onClick={() => setActiveTab("chat")}
        className={`flex flex-col items-center justify-center w-16 ${
          activeTab === "chat" ? "text-[#1a73e8]" : "text-gray-500"
        }`}
      >
        <Home className="h-5 w-5" />
        <span className="text-xs mt-0.5">Чаты</span>
      </button>
      <button
        onClick={() => setActiveTab("datasources")}
        className={`flex flex-col items-center justify-center w-16 ${
          activeTab === "datasources" ? "text-[#1a73e8]" : "text-gray-500"
        }`}
      >
        <Search className="h-5 w-5" />
        <span className="text-xs mt-0.5">База</span>
      </button>
      <button
        onClick={() => setActiveTab("examples")}
        className={`flex flex-col items-center justify-center w-16 ${
          activeTab === "examples" ? "text-[#1a73e8]" : "text-gray-500"
        }`}
      >
        <Menu className="h-5 w-5" />
        <span className="text-xs mt-0.5">Примеры</span>
      </button>
    </div>
  );
}
