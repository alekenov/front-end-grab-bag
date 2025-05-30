
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, BookOpen, ChartBar, Server, ShoppingBag, Package } from "lucide-react";

type PageType = "chats" | "guide" | "analytics" | "api" | "products" | "orders";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  activePage: PageType;
}

export function AppLayout({ children, title, activePage }: AppLayoutProps) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <main className="flex-1 flex flex-col overflow-hidden bg-[#f5f7fb] pb-14 md:pb-0">
        <div className="flex-1 overflow-hidden md:pl-16">
          {children}
        </div>
      </main>
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t flex items-center justify-around px-2 z-50">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center w-16 ${
            activePage === "chats" ? "text-[#1a73e8]" : "text-gray-500"
          }`}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-xs mt-0.5">Чаты</span>
        </Link>
        <Link
          to="/guide"
          className={`flex flex-col items-center justify-center w-16 ${
            activePage === "guide" ? "text-[#1a73e8]" : "text-gray-500"
          }`}
        >
          <BookOpen className="h-5 w-5" />
          <span className="text-xs mt-0.5">Гид</span>
        </Link>
        <Link
          to="/analytics"
          className={`flex flex-col items-center justify-center w-16 ${
            activePage === "analytics" ? "text-[#1a73e8]" : "text-gray-500"
          }`}
        >
          <ChartBar className="h-5 w-5" />
          <span className="text-xs mt-0.5">Аналитика</span>
        </Link>
        <Link
          to="/orders"
          className={`flex flex-col items-center justify-center w-16 ${
            activePage === "orders" ? "text-[#1a73e8]" : "text-gray-500"
          }`}
        >
          <Package className="h-5 w-5" />
          <span className="text-xs mt-0.5">Заказы</span>
        </Link>
        <Link
          to="/products"
          className={`flex flex-col items-center justify-center w-16 ${
            activePage === "products" ? "text-[#1a73e8]" : "text-gray-500"
          }`}
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="text-xs mt-0.5">Товары</span>
        </Link>
        <Link
          to="/api"
          className={`flex flex-col items-center justify-center w-16 ${
            activePage === "api" ? "text-[#1a73e8]" : "text-gray-500"
          }`}
        >
          <Server className="h-5 w-5" />
          <span className="text-xs mt-0.5">API</span>
        </Link>
      </div>
      <div className="hidden md:flex fixed top-0 left-0 bottom-0 w-16 bg-white border-r flex-col items-center pt-6 z-50">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center w-12 h-12 mb-2 rounded-lg ${
            activePage === "chats" 
              ? "bg-[#e8f0fe] text-[#1a73e8]" 
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <MessageSquare className="h-6 w-6" />
        </Link>
        <Link
          to="/guide"
          className={`flex flex-col items-center justify-center w-12 h-12 mb-2 rounded-lg ${
            activePage === "guide" 
              ? "bg-[#e8f0fe] text-[#1a73e8]" 
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <BookOpen className="h-6 w-6" />
        </Link>
        <Link
          to="/analytics"
          className={`flex flex-col items-center justify-center w-12 h-12 mb-2 rounded-lg ${
            activePage === "analytics" 
              ? "bg-[#e8f0fe] text-[#1a73e8]" 
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <ChartBar className="h-6 w-6" />
        </Link>
        <Link
          to="/orders"
          className={`flex flex-col items-center justify-center w-12 h-12 mb-2 rounded-lg ${
            activePage === "orders" 
              ? "bg-[#e8f0fe] text-[#1a73e8]" 
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <Package className="h-6 w-6" />
        </Link>
        <Link
          to="/products"
          className={`flex flex-col items-center justify-center w-12 h-12 mb-2 rounded-lg ${
            activePage === "products" 
              ? "bg-[#e8f0fe] text-[#1a73e8]" 
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <ShoppingBag className="h-6 w-6" />
        </Link>
        <Link
          to="/api"
          className={`flex flex-col items-center justify-center w-12 h-12 mb-2 rounded-lg ${
            activePage === "api" 
              ? "bg-[#e8f0fe] text-[#1a73e8]" 
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <Server className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
}
