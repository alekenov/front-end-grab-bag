
import { Button } from "@/components/ui/button";

interface OrderActionsProps {
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
}

export function OrderActions({ editing, onEdit, onCancel, onSave, onDelete }: OrderActionsProps) {
  if (editing) {
    return (
      <div className="space-x-2">
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          Отмена
        </Button>
        <Button onClick={onSave}>
          Сохранить
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-x-2">
      <Button 
        variant="outline" 
        onClick={onEdit}
      >
        Редактировать
      </Button>
      <Button
        variant="destructive"
        onClick={onDelete}
      >
        Удалить
      </Button>
    </div>
  );
}
