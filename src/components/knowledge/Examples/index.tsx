
import { useState } from "react";
import { ExampleList } from "./ExampleList";
import { ExampleModal } from "./ExampleModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TrainingExample, Category } from "@/types/knowledge";

export function Examples() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExample, setEditingExample] = useState<TrainingExample | null>(null);
  
  const categories: Category[] = [
    { id: "faq", name: "Частые вопросы" },
    { id: "delivery", name: "Доставка" },
    { id: "payment", name: "Оплата" },
    { id: "products", name: "Товары" }
  ];

  const [examples, setExamples] = useState<TrainingExample[]>([
    {
      id: "1",
      category: "faq",
      query: "Какой у вас график работы?",
      response: "Наш магазин работает с понедельника по пятницу с 9:00 до 20:00, в субботу с 10:00 до 18:00."
    },
    {
      id: "2",
      category: "delivery",
      query: "Сколько стоит доставка?",
      response: "Доставка по городу стоит 350 рублей. При заказе от 5000 рублей доставка бесплатная."
    }
  ]);

  const handleSaveExample = (exampleData: Omit<TrainingExample, 'id'> & { id?: string }) => {
    if (exampleData.id) {
      setExamples(examples.map(ex => 
        ex.id === exampleData.id ? { ...exampleData, id: ex.id } as TrainingExample : ex
      ));
      toast({
        title: "Пример обновлен",
        description: "Обучающий пример был успешно обновлен",
      });
    } else {
      const newExample = {
        ...exampleData,
        id: Date.now().toString(),
      } as TrainingExample;
      
      setExamples([...examples, newExample]);
      toast({
        title: "Пример добавлен",
        description: "Новый обучающий пример был успешно добавлен",
      });
    }
    
    setIsModalOpen(false);
    setEditingExample(null);
  };

  const handleDeleteExample = (id: string) => {
    setExamples(examples.filter(ex => ex.id !== id));
    toast({
      title: "Пример удален",
      description: "Обучающий пример был успешно удален",
    });
  };

  const handleEditExample = (example: TrainingExample) => {
    setEditingExample(example);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col flex-1 p-4">
      <div className="bg-white rounded-xl shadow-sm w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Обучающие примеры</h2>
          <Button 
            onClick={() => setIsModalOpen(true)} 
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Добавить
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <ExampleList
            examples={examples}
            categories={categories}
            onEdit={handleEditExample}
            onDelete={handleDeleteExample}
          />
        </div>
      </div>
      
      <ExampleModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExample(null);
        }}
        onSave={handleSaveExample}
        example={editingExample}
        categories={categories}
      />
    </div>
  );
}
