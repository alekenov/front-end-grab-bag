
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { KnowledgeItem } from "@/types/knowledge";

interface KnowledgeListProps {
  items: KnowledgeItem[];
  availableTags: string[];
  onUpdate: (id: string, content: string, tags: string[]) => void;
  onDelete: (id: string) => void;
}

export function KnowledgeList({ items, availableTags, onUpdate, onDelete }: KnowledgeListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const startEditing = (item: KnowledgeItem) => {
    setEditingId(item.id);
    setEditContent(item.content);
    setEditTags([...item.tags]);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent("");
    setEditTags([]);
  };

  const saveEditing = () => {
    if (editingId) {
      onUpdate(editingId, editContent, editTags);
      cancelEditing();
    }
  };

  const toggleTag = (tag: string) => {
    setEditTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  if (items.length === 0) {
    return <div className="text-center py-8 text-gray-500">Нет записей в базе знаний</div>;
  }

  return (
    <div className="space-y-4">
      {items.map(item => (
        <Card key={item.id} className="border-0 shadow-sm">
          <div className="bg-[#f5f7fb] flex justify-between items-center py-3 px-4">
            <h3 className="font-medium text-sm">{item.title}</h3>
            <div className="flex gap-2">
              {editingId === item.id ? (
                <>
                  <Button variant="ghost" size="sm" onClick={saveEditing}>
                    <Check className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={cancelEditing}>
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => startEditing(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
          <CardContent className="p-4">
            {editingId === item.id ? (
              <div className="space-y-4">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[100px]"
                />
                <div>
                  <p className="text-sm font-medium mb-2">Теги:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                      <Badge
                        key={tag}
                        variant={editTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="whitespace-pre-wrap text-sm">{item.content}</p>
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтверждение удаления</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить эту запись? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId);
                  setDeleteId(null);
                }
              }}
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
