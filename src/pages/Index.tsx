
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatsPage from "./ChatsPage";
import { MessageSquare, LineChart, HelpCircle, ShoppingBag, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export type TabType = "chats" | "products" | "analytics" | "guide" | "chat" | "datasources" | "examples" | "orders";

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabType>("chats");
  const navigate = useNavigate();
  
  // Добавляем логирование для отладки
  useEffect(() => {
    console.log("Index rendered with activeTab:", activeTab);
  }, [activeTab]);

  // Функция для навигации к другим страницам
  const handleTabChange = (tab: TabType) => {
    console.log("Tab change requested to:", tab);
    setActiveTab(tab);
    
    switch(tab) {
      case "products":
        navigate("/products");
        break;
      case "analytics":
        navigate("/analytics");
        break;
      case "guide":
        navigate("/guide");
        break;
      case "orders":
        navigate("/orders");
        break;
      default:
        // По умолчанию остаёмся на текущей странице/чаты
        break;
    }
  };

  // Основное содержание страницы
  const renderContent = () => {
    switch (activeTab) {
      case "chats":
        return <ChatsPage />;
      default:
        return <ChatsPage />;
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Верхняя панель для десктопа */}
      <div className="hidden md:flex border-b border-gray-200 px-4">
        <nav className="flex space-x-4">
          <Button
            variant="ghost"
            className={`px-4 py-2 ${activeTab === "chats" ? "text-blue-600" : "text-gray-600"}`}
            onClick={() => handleTabChange("chats")}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Чаты
          </Button>
          <Button
            variant="ghost"
            className={`px-4 py-2 ${activeTab === "products" ? "text-blue-600" : "text-gray-600"}`}
            onClick={() => handleTabChange("products")}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Товары
          </Button>
          <Button
            variant="ghost"
            className={`px-4 py-2 ${activeTab === "orders" ? "text-blue-600" : "text-gray-600"}`}
            onClick={() => handleTabChange("orders")}
          >
            <Package className="mr-2 h-4 w-4" />
            Заказы
          </Button>
          <Button
            variant="ghost"
            className={`px-4 py-2 ${activeTab === "analytics" ? "text-blue-600" : "text-gray-600"}`}
            onClick={() => handleTabChange("analytics")}
          >
            <LineChart className="mr-2 h-4 w-4" />
            Аналитика
          </Button>
          <Button
            variant="ghost"
            className={`px-4 py-2 ${activeTab === "guide" ? "text-blue-600" : "text-gray-600"}`}
            onClick={() => handleTabChange("guide")}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Руководство
          </Button>
        </nav>
      </div>

      {/* Основное содержание */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>

      {/* Подключение мобильной панели навигации */}
      <div className="md:hidden">
        <MobileTabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
}

// Мобильная панель навигации внизу экрана
function MobileTabBar({ activeTab, onTabChange }: { activeTab: TabType, onTabChange: (tab: TabType) => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-200 flex justify-around items-center md:hidden z-10">
      <Button
        variant="ghost"
        className={`flex flex-1 flex-col items-center justify-center h-full ${activeTab === "chats" ? "text-[#1a73e8]" : "text-gray-500"}`}
        onClick={() => onTabChange("chats")}
      >
        <MessageSquare className="h-5 w-5" />
        <span className="text-xs mt-1">Чаты</span>
      </Button>
      
      <Button
        variant="ghost"
        className={`flex flex-1 flex-col items-center justify-center h-full ${activeTab === "products" ? "text-[#1a73e8]" : "text-gray-500"}`}
        onClick={() => onTabChange("products")}
      >
        <ShoppingBag className="h-5 w-5" />
        <span className="text-xs mt-1">Товары</span>
      </Button>
      
      <Button
        variant="ghost"
        className={`flex flex-1 flex-col items-center justify-center h-full ${activeTab === "orders" ? "text-[#1a73e8]" : "text-gray-500"}`}
        onClick={() => onTabChange("orders")}
      >
        <Package className="h-5 w-5" />
        <span className="text-xs mt-1">Заказы</span>
      </Button>
      
      <Button
        variant="ghost"
        className={`flex flex-1 flex-col items-center justify-center h-full ${activeTab === "analytics" ? "text-[#1a73e8]" : "text-gray-500"}`}
        onClick={() => onTabChange("analytics")}
      >
        <LineChart className="h-5 w-5" />
        <span className="text-xs mt-1">Аналитика</span>
      </Button>
      
      <Button
        variant="ghost"
        className={`flex flex-1 flex-col items-center justify-center h-full ${activeTab === "guide" ? "text-[#1a73e8]" : "text-gray-500"}`}
        onClick={() => onTabChange("guide")}
      >
        <HelpCircle className="h-5 w-5" />
        <span className="text-xs mt-1">Помощь</span>
      </Button>
    </div>
  );
}
