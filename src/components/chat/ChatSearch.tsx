
import { Input } from "@/components/ui/input";

interface ChatSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function ChatSearch({ searchQuery, setSearchQuery }: ChatSearchProps) {
  return (
    <div className="sticky top-0 z-10 p-4 bg-white border-b border-[#e1e4e8]">
      <h1 className="text-xl font-semibold text-[#1a73e8] mb-4">WhatsApp AI</h1>
      <Input
        placeholder="Поиск чатов..."
        className="h-9"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}
