
import { useState, useEffect } from "react";
import { Tag } from "@/types/chat";
import { Tag as TagComponent } from "@/components/ui/tag";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tag as TagIcon, Plus, X } from "lucide-react";

interface TagSelectorProps {
  chatId: string;
  selectedTags?: Tag[];
  onTagsChange?: (tags: Tag[]) => void;
}

export const TagSelector = ({ chatId, selectedTags = [], onTagsChange }: TagSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Загружаем все доступные теги
  const fetchTags = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("tags")
        .select("id, name, color")
        .order("name");

      if (error) throw error;
      setAvailableTags(data || []);
    } catch (error) {
      console.error("Error fetching tags:", error);
      toast({
        title: "Ошибка загрузки тегов",
        description: "Не удалось загрузить доступные теги",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Загружаем теги для выбранного чата
  const fetchChatTags = async () => {
    if (!chatId) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("chat_tags")
        .select("tag_id, tags:tag_id(id, name, color)")
        .eq("chat_id", chatId);

      if (error) throw error;

      // Преобразуем результат в формат Tag[]
      const chatTags = data?.map(item => ({
        id: item.tags.id,
        name: item.tags.name,
        color: item.tags.color
      })) || [];

      if (onTagsChange) {
        onTagsChange(chatTags);
      }
    } catch (error) {
      console.error("Error fetching chat tags:", error);
    } finally {
      setLoading(false);
    }
  };

  // Добавляем тег к чату
  const addTagToChat = async (tag: Tag) => {
    if (!chatId) return;
    try {
      // Проверяем, не добавлен ли уже тег к чату
      if (selectedTags.some(t => t.id === tag.id)) {
        return;
      }

      setLoading(true);
      const { error } = await supabase
        .from("chat_tags")
        .insert({
          chat_id: chatId,
          tag_id: tag.id
        });

      if (error) throw error;

      // Обновляем выбранные теги
      const newSelectedTags = [...selectedTags, tag];
      if (onTagsChange) {
        onTagsChange(newSelectedTags);
      }

      toast({
        title: "Тег добавлен",
        description: `Тег "${tag.name}" успешно добавлен к чату`,
      });
    } catch (error) {
      console.error("Error adding tag:", error);
      toast({
        title: "Ошибка добавления тега",
        description: "Не удалось добавить тег к чату",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Удаляем тег из чата
  const removeTagFromChat = async (tagId: string) => {
    if (!chatId) return;
    try {
      setLoading(true);
      const { error } = await supabase
        .from("chat_tags")
        .delete()
        .eq("chat_id", chatId)
        .eq("tag_id", tagId);

      if (error) throw error;

      // Обновляем выбранные теги
      const newSelectedTags = selectedTags.filter(tag => tag.id !== tagId);
      if (onTagsChange) {
        onTagsChange(newSelectedTags);
      }

      toast({
        title: "Тег удален",
        description: "Тег успешно удален из чата",
      });
    } catch (error) {
      console.error("Error removing tag:", error);
      toast({
        title: "Ошибка удаления тега",
        description: "Не удалось удалить тег из чата",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Загружаем теги при монтировании и изменении chatId
  useEffect(() => {
    fetchTags();
    if (chatId) {
      fetchChatTags();
    }
  }, [chatId]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {selectedTags.map(tag => (
        <TagComponent 
          key={tag.id} 
          color={tag.color}
          onRemove={() => removeTagFromChat(tag.id)}
        >
          {tag.name}
        </TagComponent>
      ))}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 gap-1 px-2" 
            disabled={loading}
          >
            <TagIcon size={14} />
            <Plus size={14} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-2" align="start">
          <div className="space-y-1">
            <div className="font-medium text-sm pb-2 border-b">Добавить теги</div>
            <div className="max-h-60 overflow-y-auto pt-1">
              {availableTags.map(tag => (
                <div 
                  key={tag.id} 
                  className="flex items-center justify-between py-1 px-1 hover:bg-muted rounded-md cursor-pointer"
                  onClick={() => {
                    addTagToChat(tag);
                    setIsOpen(false);
                  }}
                >
                  <TagComponent color={tag.color}>
                    {tag.name}
                  </TagComponent>
                  {selectedTags.some(t => t.id === tag.id) && (
                    <X size={14} className="text-gray-500" />
                  )}
                </div>
              ))}
              {availableTags.length === 0 && (
                <div className="text-sm text-gray-500 py-1">Нет доступных тегов</div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
