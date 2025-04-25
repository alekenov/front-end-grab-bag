
import { useState } from "react";
import { KnowledgeList } from "./KnowledgeList";
import { AddKnowledgeDialog } from "./AddKnowledgeDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TagSelector } from "../TagSelector";
import { KnowledgeItem } from "@/types/knowledge";

export function KnowledgeBase() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const allTags = ['Доставка', 'Самовывоз', 'Адреса', 'Время работы', 'Ассортимент', 'Уход'];
  const [items, setItems] = useState<KnowledgeItem[]>([
    {
      id: "1",
      title: "Доставка",
      content: "Доставка ежедневно 9:00-21:00. По городу - 350₽. Бесплатно от 5000₽.",
      tags: ["Доставка"]
    },
    {
      id: "2",
      title: "График работы",
      content: "Пн-Пт: 9:00 - 21:00\nСб-Вс: 10:00 - 20:00\nБез перерывов и выходных",
      tags: ["Время работы"]
    }
  ]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleUpdateItem = (id: string, content: string, tags: string[]) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, content, tags } : item
    ));
    toast({
      title: "Обновлено",
      description: "Информация успешно обновлена",
    });
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Удалено",
      description: "Запись успешно удалена",
    });
  };

  const handleAddItem = (title: string, content: string, tags: string[]) => {
    const newItem: KnowledgeItem = {
      id: Date.now().toString(),
      title,
      content,
      tags
    };

    setItems(prev => [newItem, ...prev]);
    setIsAddDialogOpen(false);
    toast({
      title: "Добавлено",
      description: "Новая запись успешно создана",
    });
  };

  const filteredItems = selectedTags.length > 0
    ? items.filter(item => item.tags.some(tag => selectedTags.includes(tag)))
    : items;

  return (
    <div className="flex flex-col flex-1 p-4">
      <div className="bg-white rounded-xl shadow-sm w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">База знаний</h2>
          <Button 
            onClick={() => setIsAddDialogOpen(true)} 
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Добавить
          </Button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <TagSelector 
              availableTags={allTags}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              onClear={() => setSelectedTags([])}
              showClear={true}
            />
          </div>

          <KnowledgeList 
            items={filteredItems}
            availableTags={allTags}
            onUpdate={handleUpdateItem}
            onDelete={handleDeleteItem}
          />
        </div>
      </div>

      <AddKnowledgeDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddItem}
        availableTags={allTags}
      />
    </div>
  );
}
