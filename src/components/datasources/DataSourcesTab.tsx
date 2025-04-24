
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { KnowledgeCard } from "./KnowledgeCard";
import { useToast } from "@/hooks/use-toast";

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

export function DataSourcesTab() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
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

  const filteredItems = selectedTag 
    ? knowledgeItems.filter(item => item.tags.includes(selectedTag))
    : knowledgeItems;

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const handleUpdateKnowledgeItem = (id: string, updatedContent: string) => {
    const API_URL = window.APP_CONFIG?.API_URL || '/api';
    
    // In a real application, you would send this update to your API
    // For now, we'll just update the state locally
    setKnowledgeItems(prev => prev.map(item => 
      item.id === id ? { ...item, content: updatedContent } : item
    ));
    
    // Simulate API call with a toast notification
    toast({
      title: "Обновлено",
      description: "Информация успешно обновлена",
    });
    
    // Example of how the API call would look:
    /* 
    fetch(`${API_URL}/knowledge/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: updatedContent }),
    })
    .then(response => {
      if (!response.ok) throw new Error('Ошибка обновления');
      return response.json();
    })
    .then(() => {
      toast({
        title: "Обновлено",
        description: "Информация успешно обновлена",
      });
    })
    .catch(error => {
      console.error('Ошибка:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось обновить информацию",
      });
    });
    */
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto p-2 md:p-4">
      <h2 className="text-lg font-semibold mb-3">База знаний</h2>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {allTags.map((tag) => (
          <Badge 
            key={tag}
            variant={selectedTag === tag ? "default" : "outline"} 
            className={`px-3 py-1 text-xs cursor-pointer hover:bg-primary/10 transition-colors ${
              selectedTag === tag ? 'bg-primary text-primary-foreground' : ''
            }`}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>

      <div className="grid gap-3">
        {filteredItems.map((item) => (
          <KnowledgeCard
            key={item.id}
            title={item.title}
            content={item.content}
            onSave={(updatedContent) => handleUpdateKnowledgeItem(item.id, updatedContent)}
          />
        ))}
      </div>
    </div>
  );
}
