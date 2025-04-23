
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader 
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { TrainingExample, Category } from './ExamplesTab';

interface ExampleCardProps {
  example: TrainingExample;
  categories: Category[];
  onEdit: () => void;
  onDelete: () => void;
}

export function ExampleCard({ example, categories, onEdit, onDelete }: ExampleCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  return (
    <>
      <Card>
        <CardHeader className="bg-[#f5f7fb] flex flex-row justify-between items-center py-3 px-4">
          <div className="text-sm font-medium text-[#1a73e8] uppercase">
            {getCategoryName(example.category)}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Редактировать</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Удалить</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Запрос пользователя:</h4>
            <p className="text-sm whitespace-pre-wrap">{example.query}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Ответ бота:</h4>
            <p className="text-sm text-[#1a73e8] whitespace-pre-wrap">{example.response}</p>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтверждение удаления</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить этот пример? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={onDelete}
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
