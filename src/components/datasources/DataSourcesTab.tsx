
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { KnowledgeList } from "./KnowledgeList";
import { AddKnowledgeDialog } from "./AddKnowledgeDialog";
import { TagSelector } from "./TagSelector";

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

export function DataSourcesTab() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([
    {
      id: "1",
      title: "Доставка",
      content: "Доставка ежедневно 9:00-21:00. По городу - 350₽. Бесплатно от 5000₽. Заказ в тот же день при оформлении до 19:00.",
      tags: ["Доставка"]
    },
    {
      id: "2",
      title: "Самовывоз",
      content: "Доступен из двух магазинов: ТЦ 'Центральный' (1 этаж), ТЦ 'Радуга' (2 этаж). Готовность через 2 часа.",
      tags: ["Самовывоз"]
    },
    {
      id: "3",
      title: "Адреса магазинов",
      content: "ТЦ 'Центральный': ул. Ленина, 45\nТЦ 'Радуга': пр. Мира, 78",
      tags: ["Адреса"]
    },
    {
      id: "4",
      title: "График работы",
      content: "Пн-Пт: 9:00 - 21:00\nСб-Вс: 10:00 - 20:00\nБез перерывов и выходных",
      tags: ["Время работы"]
    }
  ]);
  
  const { toast } = useToast();
  const allTags = ['Доставка', 'Самовывоз', 'Адреса', 'Время работы', 'Ассортимент', 'Уход'];

  const filteredItems = selectedTags.length > 0
    ? knowledgeItems.filter(item => item.tags.some(tag => selectedTags.includes(tag)))
    : knowledgeItems;

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const handleUpdateKnowledgeItem = (id: string, updatedContent: string, updatedTags: string[]) => {
    setKnowledgeItems(prev => prev.map(item => 
      item.id === id ? { ...item, content: updatedContent, tags: updatedTags } : item
    ));
    
    toast({
      title: "Обновлено",
      description: "Информация успешно обновлена",
    });
  };

  const handleDeleteItem = (id: string) => {
    setKnowledgeItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Удалено",
      description: "Запись успешно удалена",
    });
  };

  const handleAddItem = (title: string, content: string, tags: string[]) => {
    // Убираем проверку на пустой заголовок
    if (!content.trim() || tags.length === 0) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Заполните содержание и выберите хотя бы один тег",
      });
      return;
    }

    const newItem: KnowledgeItem = {
      id: Date.now().toString(),
      title, // Заголовок может быть пустым
      content,
      tags
    };

    setKnowledgeItems(prev => [newItem, ...prev]);
    setIsAddDialogOpen(false);

    toast({
      title: "Добавлено",
      description: "Новая запись успешно создана",
    });
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto p-2 md:p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">База знаний</h2>
        <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Добавить
        </Button>
      </div>
      
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
        onUpdate={handleUpdateKnowledgeItem}
        onDelete={handleDeleteItem}
      />

      <AddKnowledgeDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddItem}
        availableTags={allTags}
      />
    </div>
  );
}
