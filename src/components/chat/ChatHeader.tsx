import { useState } from "react";
import { User, Phone, ArrowLeft, Edit, Check, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatHeaderProps {
  phoneNumber?: string;
  contactName?: string;
  tags?: string[];
  onBack: () => void;
  onUpdateContact?: (name: string, tags: string[]) => void;
}

export function ChatHeader({ 
  phoneNumber = "+7 (999) 123-45-67", 
  contactName = "Иван Петров", 
  tags = ["пионы", "самовывоз"], 
  onBack,
  onUpdateContact
}: ChatHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(contactName);
  const [editTags, setEditTags] = useState<string[]>(tags);
  const [newTag, setNewTag] = useState("");
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleSave = () => {
    if (onUpdateContact) {
      onUpdateContact(editName, editTags);
    } else {
      // Если нет реального API, показываем тост
      toast({
        title: "Данные сохранены",
        description: "Имя клиента и теги успешно обновлены",
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(contactName);
    setEditTags([...tags]);
    setIsEditing(false);
  };

  const addTag = () => {
    if (newTag.trim() && !editTags.includes(newTag.trim())) {
      setEditTags([...editTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditTags(editTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className={`sticky top-0 z-10 ${isMobile ? 'px-3 py-4' : 'p-4'} bg-white border-b border-[#e1e4e8]`}>
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
            {!isEditing && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 text-gray-500" />
              </Button>
            )}
            {isEditing && (
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-green-500" 
                  onClick={handleSave}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-red-500" 
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          {!isEditing ? (
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
          ) : (
            <div className="space-y-2 mt-2">
              <div className="flex items-center gap-2">
                <User size={14} className="text-gray-500" />
                <Input 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  className="h-7 text-sm" 
                  placeholder="Имя клиента"
                />
              </div>
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editTags.map((tag) => (
                    <Badge key={tag} className="flex items-center gap-1 px-2 py-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    value={newTag} 
                    onChange={(e) => setNewTag(e.target.value)} 
                    className="h-7 text-sm" 
                    placeholder="Новый тег"
                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button 
                    size="sm" 
                    className="h-7" 
                    onClick={addTag}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Добавить
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
