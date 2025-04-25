
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TagSelector } from "./TagSelector";

interface AddKnowledgeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, content: string, tags: string[]) => void;
  availableTags: string[];
}

export function AddKnowledgeDialog({ 
  isOpen, 
  onClose, 
  onAdd,
  availableTags 
}: AddKnowledgeDialogProps) {
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState<string[]>([]);

  const handleAddItem = () => {
    // Добавляем пустой заголовок, так как он не используется
    onAdd("", newContent, newTags);
    setNewContent("");
    setNewTags([]);
  };

  const handleTagSelect = (tag: string) => {
    setNewTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить новую запись</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Содержание
            </label>
            <Textarea
              id="content"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Введите текст"
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Теги
            </label>
            <TagSelector
              availableTags={availableTags}
              selectedTags={newTags}
              onTagToggle={handleTagSelect}
              showClear={false}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleAddItem}>
            Добавить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
