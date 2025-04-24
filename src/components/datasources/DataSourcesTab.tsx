import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { KnowledgeCard } from "./KnowledgeCard";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

export function DataSourcesTab() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
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
    setKnowledgeItems(prev => prev.map(item => 
      item.id === id ? { ...item, content: updatedContent } : item
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

  const [selectedNewTag, setSelectedNewTag] = useState<string>("");

  const handleAddItem = () => {
    if (!newTitle.trim() || !newContent.trim() || !selectedNewTag) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Заполните все поля",
      });
      return;
    }

    const newItem: KnowledgeItem = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
      tags: [selectedNewTag]
    };

    setKnowledgeItems(prev => [newItem, ...prev]);
    setNewTitle("");
    setNewContent("");
    setSelectedNewTag("");
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
          <div key={item.id} className="relative group">
            <KnowledgeCard
              title={item.title}
              content={item.content}
              onSave={(updatedContent) => handleUpdateKnowledgeItem(item.id, updatedContent)}
              onDelete={() => handleDeleteItem(item.id)}
            />
          </div>
        ))}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить новую запись</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Заголовок
              </label>
              <Textarea
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Введите заголовок"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Содержание
              </label>
              <Textarea
                id="content"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Введите текст"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Тег
              </label>
              <Select value={selectedNewTag} onValueChange={setSelectedNewTag}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тег" />
                </SelectTrigger>
                <SelectContent>
                  {allTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleAddItem}>
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
