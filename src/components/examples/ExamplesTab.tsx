
import { ExampleCard } from "./ExampleCard";
import { ExampleModal } from "./ExampleModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";

export function ExamplesTab() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm m-5 mt-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Обучающие примеры</h2>
          <Button onClick={() => setIsModalOpen(true)} className="bg-[#1a73e8] hover:bg-[#1558b3]">
            <Plus className="h-4 w-4 mr-2" /> Добавить пример
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <ExampleCard 
            id="1"
            category="faq"
            query="Какой у вас график работы?"
            response="Наш магазин работает с понедельника по пятницу с 9:00 до 20:00, в субботу с 10:00 до 18:00. В воскресенье мы закрыты."
          />
          <ExampleCard 
            id="2"
            category="catalog"
            query="Какие цветы есть в наличии?"
            response="У нас в наличии есть розы, лилии, тюльпаны, хризантемы и многие другие цветы. Вы можете посмотреть полный каталог на нашем сайте или уточнить наличие конкретного вида цветов у наших консультантов."
          />
        </div>
        
        <ExampleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
}
