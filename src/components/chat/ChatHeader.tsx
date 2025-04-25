
import { User, Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  phoneNumber?: string;
  contactName?: string;
  tags?: string[];
  onBack: () => void;
}

export function ChatHeader({ phoneNumber = "+7 (999) 123-45-67", contactName = "Иван Петров", tags = ["пионы", "самовывоз"], onBack }: ChatHeaderProps) {
  return (
    <div className="sticky top-0 z-10 p-4 bg-white border-b border-[#e1e4e8]">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 shrink-0"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Phone size={18} className="text-gray-500" />
            <h2 className="text-lg font-semibold truncate">{phoneNumber}</h2>
          </div>
          <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{contactName}</span>
            </div>
            <div className="flex gap-2">
              {tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
