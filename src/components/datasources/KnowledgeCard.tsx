import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Check, X, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { TagSelector } from "./TagSelector";

interface KnowledgeCardProps {
  title: string;
  content: string;
  tags: string[];
  onSave: (updatedContent: string, updatedTags: string[]) => void;
  onDelete: () => void;
  availableTags: string[];
}

export function KnowledgeCard({ 
  content, 
  tags = [], 
  onSave, 
  onDelete,
  availableTags 
}: KnowledgeCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [editedTags, setEditedTags] = useState<string[]>(tags || []);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSave = () => {
    onSave(editedContent, editedTags);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(content);
    setEditedTags(tags || []);
    setIsEditing(false);
  };

  const handleTagToggle = (tag: string) => {
    setEditedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[80px] text-sm"
            />
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500">
                Теги
              </label>
              <TagSelector
                availableTags={availableTags}
                selectedTags={editedTags}
                onTagToggle={handleTagToggle}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Удалить
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleCancel}
              >
                <X className="h-4 w-4 mr-1" />
                Отмена
              </Button>
              <Button 
                size="sm"
                onClick={handleSave}
              >
                <Check className="h-4 w-4 mr-1" />
                Сохранить
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative group">
            <p className="text-sm text-gray-600 whitespace-pre-wrap mb-3">{content}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {(tags || []).map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary"
                  className="text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 right-0"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить запись?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Запись будет удалена навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
