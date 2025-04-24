import { useState } from "react";
import { ExampleCard } from "./ExampleCard";
import { ExampleModal } from "./ExampleModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define and export types needed by other components
export interface TrainingExample {
  id: string;
  category: string;
  query: string;
  response: string;
}

export interface Category {
  id: string;
  name: string;
}

export function ExamplesTab() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExample, setEditingExample] = useState<TrainingExample | null>(null);
  const [examples, setExamples] = useState<TrainingExample[]>([
    {
      id: "1",
      category: "faq",
      query: "Какой у вас график работы?",
      response: "Наш магазин работает с понедельника по пятницу с 9:00 до 20:00, в субботу с 10:00 до 18:00. В воскресенье мы закрыты."
    },
    {
      id: "2",
      category: "catalog",
      query: "Какие цветы есть в наличии?",
      response: "У нас в наличии есть розы, лилии, тюльпаны, хризантемы и многие другие цветы. Вы можете посмотреть полный каталог на нашем сайте или уточнить наличие конкретного вида цветов у наших консультантов."
    }
  ]);
  
  // Sample categories
  const categories: Category[] = [
    { id: "faq", name: "Частые вопросы" },
    { id: "catalog", name: "Каталог" },
    { id: "delivery", name: "Доставка" },
    { id: "payment", name: "Оплата" }
  ];

  const handleSaveExample = (exampleData: Omit<TrainingExample, 'id'> & { id?: string }) => {
    if (exampleData.id) {
      // Update existing example
      setExamples(examples.map(ex => 
        ex.id === exampleData.id ? { ...exampleData, id: ex.id } as TrainingExample : ex
      ));
      toast({
        title: "Пример обновлен",
        description: "Обучающий пример был успешно обновлен",
      });
    } else {
      // Add new example
      const newExample = {
        ...exampleData,
        id: Date.now().toString(), // Generate a simple id
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
    <div className="flex flex-col flex-1 p-0 bg-[#f5f7fb]">
      <div className="flex flex-col w-full p-4">
        <div className="bg-white rounded-xl shadow-md w-full">
          <div className="flex justify-between items-center p-3 border-b">
            <h2 className="text-xl font-bold text-blue-800">Обучающие примеры</h2>
            <Button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1 px-2 py-1 h-8"
              size="sm"
            >
              <Plus className="h-3 w-3" /> <span className="text-xs">Добавить</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
            {examples.map(example => (
              <ExampleCard 
                key={example.id}
                example={example}
                categories={categories}
                onEdit={() => handleEditExample(example)}
                onDelete={() => handleDeleteExample(example.id)}
              />
            ))}
          </div>
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
