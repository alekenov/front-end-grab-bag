
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Check, X } from "lucide-react";

interface KnowledgeCardProps {
  title: string;
  content: string;
  onSave: (updatedContent: string) => void;
  onDelete: () => void;
}

export function KnowledgeCard({ title, content, onSave, onDelete }: KnowledgeCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleSave = () => {
    onSave(editedContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="p-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm">{title}</CardTitle>
        {!isEditing && (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-3 pt-0 relative">
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[80px] text-xs"
            />
            <div className="flex justify-end gap-2">
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
          <>
            <p className="text-xs text-gray-600 whitespace-pre-wrap pr-10">{content}</p>
            <Button
              variant="destructive"
              size="icon"
              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
