
import { ActionButtons, ActionButtonConfig } from "@/components/ui/action-buttons";
import { Edit, Save, X, Trash2 } from "lucide-react";

interface OrderActionsProps {
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
}

export function OrderActions({ editing, onEdit, onCancel, onSave, onDelete }: OrderActionsProps) {
  const buttons: ActionButtonConfig[] = editing ? [
    {
      id: "cancel",
      label: "Отмена",
      icon: X,
      variant: "outline",
      onClick: onCancel
    },
    {
      id: "save", 
      label: "Сохранить",
      icon: Save,
      onClick: onSave
    }
  ] : [
    {
      id: "edit",
      label: "Редактировать", 
      icon: Edit,
      variant: "outline",
      onClick: onEdit
    },
    {
      id: "delete",
      label: "Удалить",
      icon: Trash2,
      variant: "destructive", 
      onClick: onDelete
    }
  ];

  return <ActionButtons buttons={buttons} />;
}
