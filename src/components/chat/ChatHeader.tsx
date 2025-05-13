
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  MoreVertical,
  Tag as TagIcon,
  Settings,
  RefreshCcw,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tag } from "@/types/chat";
import { TagSelector } from "./TagSelector";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type ContactDetails = {
  name: string;
  tags: Tag[];
  phone?: string;
  source?: string;
};

type ChatHeaderProps = {
  onBack?: () => void;
  contactName: string;
  tags?: Tag[];
  source?: string;
  phoneNumber?: string;
  onUpdateContact?: (name: string, tags: string[]) => void;
};

export function ChatHeader({
  onBack,
  contactName,
  tags: initialTags = [],
  source,
  phoneNumber,
  onUpdateContact
}: ChatHeaderProps) {
  const [isAiEnabled, setIsAiEnabled] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  
  // Функция для изменения состояния AI
  const toggleAi = () => {
    setIsAiEnabled(!isAiEnabled);
    // Здесь должен быть вызов API для изменения состояния AI
  };

  // Функция для обновления чата
  const refreshChat = () => {
    setIsRefreshing(true);
    // Имитация задержки обновления
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // Обновляем tags при изменении initialTags
  useEffect(() => {
    setTags(initialTags);
  }, [initialTags]);

  // Обработчик изменения тегов
  const handleTagsChange = (newTags: Tag[]) => {
    setTags(newTags);
    if (onUpdateContact) {
      onUpdateContact(contactName, newTags.map(tag => tag.name));
    }
  };

  const chatId = typeof onBack === 'function' ? 'current-chat-id' : '';
  const isWhatsApp = source === 'whatsapp';

  return (
    <div className="h-16 min-h-[64px] px-4 border-b border-[#e1e4e8] flex items-center justify-between bg-white">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={onBack}
          >
            <ArrowLeft size={18} />
          </Button>
        )}
        <div>
          <div className="font-medium">
            {contactName}
            {isWhatsApp && phoneNumber && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="ml-2 text-gray-500 text-sm inline-flex items-center">
                      <Phone size={14} className="mr-1" />
                      {phoneNumber}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>WhatsApp контакт</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <TagSelector 
          chatId={chatId}
          selectedTags={tags} 
          onTagsChange={handleTagsChange}
        />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
            >
              <MoreVertical size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={toggleAi}>
              {isAiEnabled ? (
                <>
                  <ToggleRight className="mr-2 h-4 w-4" />
                  <span>Отключить AI</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="mr-2 h-4 w-4" />
                  <span>Включить AI</span>
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={refreshChat} disabled={isRefreshing}>
              {isRefreshing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Обновление...</span>
                </>
              ) : (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  <span>Обновить чат</span>
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Настройки</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
