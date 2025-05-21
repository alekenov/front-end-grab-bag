
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductCategorySelectProps {
  category: string;
  onCategoryChange: (category: string) => void;
  predefinedCategories: string[];
}

export function ProductCategorySelect({ 
  category, 
  onCategoryChange, 
  predefinedCategories 
}: ProductCategorySelectProps) {
  const [newCategory, setNewCategory] = useState<string>("");

  const handleSelectCategory = (selectedCategory: string) => {
    // Если выбрана опция "Создать новую категорию"
    if (selectedCategory === "new") {
      onCategoryChange("");
      return;
    }
    
    onCategoryChange(selectedCategory);
    setNewCategory("");
  };

  const handleCreateCategory = () => {
    if (newCategory.trim()) {
      onCategoryChange(newCategory.trim());
      setNewCategory("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label htmlFor="category">Категория</Label>
        {newCategory && (
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={handleCreateCategory}
          >
            Добавить
          </Button>
        )}
      </div>
      
      {newCategory ? (
        <Input
          placeholder="Название новой категории"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleCreateCategory();
            }
          }}
        />
      ) : (
        <Select 
          value={category} 
          onValueChange={handleSelectCategory}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Выберите категорию" />
          </SelectTrigger>
          <SelectContent>
            {predefinedCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
            <SelectItem value="new">+ Создать новую категорию</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
