
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TagSelectorProps {
  availableTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClear?: () => void;
  showClear?: boolean;
}

export function TagSelector({ availableTags, selectedTags, onTagToggle, onClear, showClear = false }: TagSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {availableTags.map((tag) => (
        <Badge 
          key={tag}
          variant={selectedTags.includes(tag) ? "default" : "outline"} 
          className="px-3 py-1 text-xs cursor-pointer hover:bg-primary/10 transition-colors"
          onClick={() => onTagToggle(tag)}
        >
          {tag}
          {selectedTags.includes(tag) && (
            <Check className="ml-1 h-3 w-3" />
          )}
        </Badge>
      ))}
      {showClear && selectedTags.length > 0 && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClear}
          className="h-7 px-2"
        >
          <X className="h-4 w-4 mr-1" />
          Очистить
        </Button>
      )}
    </div>
  );
}
