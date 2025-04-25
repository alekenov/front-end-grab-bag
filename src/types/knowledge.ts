
export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

export interface TrainingExample {
  id: string;
  category: string;
  query: string;
  response: string;
}

export interface Category {
  id: string;
  name: string;
}
