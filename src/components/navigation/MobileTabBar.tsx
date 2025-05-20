
import { TabType } from "@/pages/Index";
import { MessageSquare, Database, LineChart, HelpCircle, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface MobileTabBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export function MobileTabBar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-200 flex justify-around items-center md:hidden z-10">
      <Link
        to="/"
        className={`flex flex-1 flex-col items-center justify-center h-full ${
          currentPath === "/" ? "text-[#1a73e8]" : "text-gray-500"
        }`}
      >
        <MessageSquare className="h-5 w-5" />
        <span className="text-xs mt-1">Чаты</span>
      </Link>
      
      <Link
        to="/products"
        className={`flex flex-1 flex-col items-center justify-center h-full ${
          currentPath === "/products" ? "text-[#1a73e8]" : "text-gray-500"
        }`}
      >
        <Database className="h-5 w-5" />
        <span className="text-xs mt-1">Товары</span>
      </Link>
      
      <Link
        to="/orders"
        className={`flex flex-1 flex-col items-center justify-center h-full ${
          currentPath.startsWith("/orders") ? "text-[#1a73e8]" : "text-gray-500"
        }`}
      >
        <ShoppingBag className="h-5 w-5" />
        <span className="text-xs mt-1">Заказы</span>
      </Link>
      
      <Link
        to="/analytics"
        className={`flex flex-1 flex-col items-center justify-center h-full ${
          currentPath === "/analytics" ? "text-[#1a73e8]" : "text-gray-500"
        }`}
      >
        <LineChart className="h-5 w-5" />
        <span className="text-xs mt-1">Аналитика</span>
      </Link>
      
      <Link
        to="/guide"
        className={`flex flex-1 flex-col items-center justify-center h-full ${
          currentPath === "/guide" ? "text-[#1a73e8]" : "text-gray-500"
        }`}
      >
        <HelpCircle className="h-5 w-5" />
        <span className="text-xs mt-1">Помощь</span>
      </Link>
    </div>
  );
}
