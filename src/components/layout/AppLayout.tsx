
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Database } from "lucide-react";

type PageType = "chats" | "knowledge";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  activePage: PageType;
}

export function AppLayout({ children, title, activePage }: AppLayoutProps) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <main className="flex-1 flex flex-col overflow-hidden bg-[#f5f7fb] pb-14 md:pb-0">
        {children}
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
          to="/knowledge"
          className={`flex flex-col items-center justify-center w-16 ${
            activePage === "knowledge" ? "text-[#1a73e8]" : "text-gray-500"
          }`}
        >
          <Database className="h-5 w-5" />
          <span className="text-xs mt-0.5">База знаний</span>
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
          to="/knowledge"
          className={`flex flex-col items-center justify-center w-12 h-12 mb-2 rounded-lg ${
            activePage === "knowledge" 
              ? "bg-[#e8f0fe] text-[#1a73e8]" 
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <Database className="h-6 w-6" />
        </Link>
      </div>
      <div className="hidden md:block md:ml-16" /> {/* Spacing for sidebar */}
    </div>
  );
}
