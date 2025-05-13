
import { useState } from "react";
import { ChatList } from "@/components/chat/ChatList";
import { ChatSearch } from "@/components/chat/ChatSearch";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ChatListContainerProps {
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
}

export function ChatListContainer({ currentChatId, setCurrentChatId }: ChatListContainerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    unreadOnly: false,
    whatsappOnly: false,
    telegramOnly: false,
    aiEnabled: false
  });
  
  const handleFilterChange = (filterName: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };
  
  return (
    <div className="flex flex-col h-full w-full">
      <div className="sticky top-0 z-10 bg-white">
        <div className="p-4 border-b border-[#e1e4e8]">
          <h1 className="text-xl font-semibold text-[#1a73e8] mb-4">WhatsApp AI</h1>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <ChatSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
                  <Filter size={18} />
                  {(filters.unreadOnly || filters.whatsappOnly || filters.telegramOnly || filters.aiEnabled) && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-500"></span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-4" align="end">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Фильтры чатов</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="unread" 
                      checked={filters.unreadOnly} 
                      onCheckedChange={() => handleFilterChange('unreadOnly')}
                    />
                    <Label htmlFor="unread">Только непрочитанные</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="whatsapp" 
                      checked={filters.whatsappOnly} 
                      onCheckedChange={() => handleFilterChange('whatsappOnly')}
                    />
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="telegram" 
                      checked={filters.telegramOnly} 
                      onCheckedChange={() => handleFilterChange('telegramOnly')}
                    />
                    <Label htmlFor="telegram">Telegram</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="aiEnabled" 
                      checked={filters.aiEnabled} 
                      onCheckedChange={() => handleFilterChange('aiEnabled')}
                    />
                    <Label htmlFor="aiEnabled">AI включен</Label>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ChatList 
          searchQuery={searchQuery}
          currentChatId={currentChatId}
          setCurrentChatId={setCurrentChatId}
          filters={filters}
        />
      </div>
    </div>
  );
}
