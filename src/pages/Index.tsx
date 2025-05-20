
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatsPage from "./ChatsPage";
import { MessageSquare, Database, LineChart, HelpCircle, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export type TabType = "chats" | "products" | "analytics" | "guide" | "chat" | "datasources" | "examples" | "orders";

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabType>("chats");
  const navigate = useNavigate();

  // Основное содержание страницы
  const renderContent = () => {
    switch (activeTab) {
      case "chats":
        return <ChatsPage />;
      case "products":
        navigate("/products");
        return null;
      case "analytics":
        navigate("/analytics");
        return null;
      case "guide":
        navigate("/guide");
        return null;
      case "orders":
        navigate("/orders");
        return null;
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
            onClick={() => setActiveTab("chats")}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Чаты
          </Button>
          <Link to="/products">
            <Button
              variant="ghost"
              className="px-4 py-2 text-gray-600"
            >
              <Database className="mr-2 h-4 w-4" />
              Товары
            </Button>
          </Link>
          <Link to="/orders">
            <Button
              variant="ghost"
              className="px-4 py-2 text-gray-600"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Заказы
            </Button>
          </Link>
          <Link to="/analytics">
            <Button
              variant="ghost"
              className="px-4 py-2 text-gray-600"
            >
              <LineChart className="mr-2 h-4 w-4" />
              Аналитика
            </Button>
          </Link>
          <Link to="/guide">
            <Button
              variant="ghost"
              className="px-4 py-2 text-gray-600"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Руководство
            </Button>
          </Link>
        </nav>
      </div>

      {/* Основное содержание */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>

      {/* Подключение мобильной панели навигации */}
      <div className="md:hidden">
        <MobileTabBar />
      </div>
    </div>
  );
}

// Мобильная панель навигации внизу экрана
function MobileTabBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-200 flex justify-around items-center md:hidden z-10">
      <Link
        to="/"
        className="flex flex-1 flex-col items-center justify-center h-full text-[#1a73e8]"
      >
        <MessageSquare className="h-5 w-5" />
        <span className="text-xs mt-1">Чаты</span>
      </Link>
      
      <Link
        to="/products"
        className="flex flex-1 flex-col items-center justify-center h-full text-gray-500"
      >
        <Database className="h-5 w-5" />
        <span className="text-xs mt-1">Товары</span>
      </Link>
      
      <Link
        to="/orders"
        className="flex flex-1 flex-col items-center justify-center h-full text-gray-500"
      >
        <ShoppingBag className="h-5 w-5" />
        <span className="text-xs mt-1">Заказы</span>
      </Link>
      
      <Link
        to="/analytics"
        className="flex flex-1 flex-col items-center justify-center h-full text-gray-500"
      >
        <LineChart className="h-5 w-5" />
        <span className="text-xs mt-1">Аналитика</span>
      </Link>
      
      <Link
        to="/guide"
        className="flex flex-1 flex-col items-center justify-center h-full text-gray-500"
      >
        <HelpCircle className="h-5 w-5" />
        <span className="text-xs mt-1">Помощь</span>
      </Link>
    </div>
  );
}
