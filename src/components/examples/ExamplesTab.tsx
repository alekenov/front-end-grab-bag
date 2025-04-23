
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExampleCard } from './ExampleCard';
import { ExampleModal } from './ExampleModal';
import { useToast } from '@/hooks/use-toast';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all-categories');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExample, setCurrentExample] = useState<TrainingExample | null>(null);
  const API_URL = window.APP_CONFIG?.API_URL || '/api';

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/categories`);
      if (!response.ok) throw new Error('Ошибка загрузки категорий');
      return response.json() as Promise<Category[]>;
    }
  });

  // Fetch examples
  const { 
    data: examples = [], 
    isLoading,
    error,
    refetch: refetchExamples
  } = useQuery({
    queryKey: ['training-examples'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/training-examples`);
      if (!response.ok) throw new Error('Ошибка загрузки примеров');
      return response.json() as Promise<TrainingExample[]>;
    }
  });

  // Filter examples
  const filteredExamples = examples.filter(example => {
    const matchesSearch = 
      example.query.toLowerCase().includes(searchQuery.toLowerCase()) || 
      example.response.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all-categories' || example.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Handle creating new example
  const handleAddExample = () => {
    setCurrentExample(null);
    setIsModalOpen(true);
  };

  // Handle editing example
  const handleEditExample = (example: TrainingExample) => {
    setCurrentExample(example);
    setIsModalOpen(true);
  };

  // Handle deleting example
  const handleDeleteExample = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/training-examples/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Ошибка удаления примера');
      
      await refetchExamples();
      toast({
        title: "Успешно",
        description: "Пример был удален",
      });
    } catch (error) {
      console.error('Ошибка удаления примера:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось удалить пример",
      });
    }
  };

  // Handle saving example (create or update)
  const handleSaveExample = async (example: Omit<TrainingExample, 'id'> & { id?: string }) => {
    try {
      const isNew = !example.id;
      const url = isNew 
        ? `${API_URL}/training-examples` 
        : `${API_URL}/training-examples/${example.id}`;
      
      const response = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isNew ? example : { category: example.category, query: example.query, response: example.response }),
      });

      if (!response.ok) throw new Error(`Ошибка ${isNew ? 'создания' : 'обновления'} примера`);
      
      await refetchExamples();
      setIsModalOpen(false);
      toast({
        title: "Успешно",
        description: `Пример был ${isNew ? 'создан' : 'обновлен'}`,
      });
    } catch (error) {
      console.error('Ошибка сохранения примера:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: `Не удалось ${currentExample ? 'обновить' : 'создать'} пример`,
      });
    }
  };

  return (
    <div className="flex-1 p-5">
      <div className="bg-white p-6 rounded-lg shadow-sm h-full flex flex-col">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Обучающие примеры</h2>
          <Button onClick={handleAddExample}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить пример
          </Button>
        </div>
        
        <div className="bg-[#f5f7fb] p-4 rounded-md mb-5 flex gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <label htmlFor="search-example" className="text-sm font-medium">Поиск:</label>
            <Input 
              id="search-example" 
              placeholder="Поиск в примерах..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="flex items-center gap-2 min-w-[200px]">
            <label htmlFor="category-filter" className="text-sm font-medium">Категория:</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger id="category-filter" className="w-[180px] h-9">
                <SelectValue placeholder="Все категории" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all" value="all-categories">Все категории</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">Загрузка примеров...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">Ошибка загрузки примеров</div>
          ) : filteredExamples.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              {searchQuery || categoryFilter !== 'all-categories' 
                ? 'Нет примеров, соответствующих фильтрам' 
                : 'Нет обучающих примеров'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredExamples.map(example => (
                <ExampleCard 
                  key={example.id}
                  example={example}
                  categories={categories}
                  onEdit={() => handleEditExample(example)}
                  onDelete={() => handleDeleteExample(example.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <ExampleModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveExample}
          example={currentExample}
          categories={categories}
        />
      )}
    </div>
  );
}
