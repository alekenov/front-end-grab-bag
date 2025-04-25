
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrainingExample, Category } from './ExamplesTab';

interface ExampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (example: Omit<TrainingExample, 'id'> & { id?: string }) => void;
  example: TrainingExample | null;
  categories: Category[];
}

export function ExampleModal({ isOpen, onClose, onSave, example, categories }: ExampleModalProps) {
  const [formData, setFormData] = useState({
    id: '',
    category: '',
    query: '',
    response: ''
  });

  // Initialize form with example data if editing
  useEffect(() => {
    if (example) {
      setFormData({
        id: example.id,
        category: example.category,
        query: example.query,
        response: example.response
      });
    } else {
      setFormData({
        id: '',
        category: '',
        query: '',
        response: ''
      });
    }
  }, [example]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const isFormValid = formData.category && formData.query && formData.response;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {example ? 'Редактировать пример' : 'Добавить пример'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">Категория</Label>
              <Select 
                value={formData.category} 
                onValueChange={value => handleChange('category', value)}
                required
              >
                <SelectTrigger id="category" className="text-sm">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="query">Запрос пользователя</Label>
              <Textarea 
                id="query" 
                value={formData.query}
                onChange={e => handleChange('query', e.target.value)}
                placeholder="Введите пример вопроса пользователя..."
                className="min-h-[100px] text-sm"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="response">Ответ бота</Label>
              <Textarea 
                id="response" 
                value={formData.response}
                onChange={e => handleChange('response', e.target.value)}
                placeholder="Введите пример ответа бота..."
                className="min-h-[100px] text-sm"
                required
              />
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={!isFormValid}>
              Сохранить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
