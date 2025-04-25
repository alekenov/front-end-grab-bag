
import { ExampleCard } from "./ExampleCard";
import { TrainingExample, Category } from "@/types/knowledge";

interface ExampleListProps {
  examples: TrainingExample[];
  categories: Category[];
  onEdit: (example: TrainingExample) => void;
  onDelete: (id: string) => void;
}

export function ExampleList({ examples, categories, onEdit, onDelete }: ExampleListProps) {
  return (
    <>
      {examples.map(example => (
        <ExampleCard
          key={example.id}
          example={example}
          categories={categories}
          onEdit={() => onEdit(example)}
          onDelete={() => onDelete(example.id)}
        />
      ))}
    </>
  );
}
