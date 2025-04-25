
import { KnowledgeCard } from "./KnowledgeCard";

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

interface KnowledgeListProps {
  items: KnowledgeItem[];
  availableTags: string[];
  onUpdate: (id: string, content: string, tags: string[]) => void;
  onDelete: (id: string) => void;
}

export function KnowledgeList({ items, availableTags, onUpdate, onDelete }: KnowledgeListProps) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div key={item.id} className="relative group">
          <KnowledgeCard
            title={item.title}
            content={item.content}
            tags={item.tags}
            availableTags={availableTags}
            onSave={(updatedContent, updatedTags) => onUpdate(item.id, updatedContent, updatedTags)}
            onDelete={() => onDelete(item.id)}
          />
        </div>
      ))}
    </div>
  );
}
