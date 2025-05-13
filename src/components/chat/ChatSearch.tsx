
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface ChatSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function ChatSearch({ searchQuery, setSearchQuery }: ChatSearchProps) {
  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="relative">
      <Input
        placeholder="Поиск чатов..."
        className="h-9 pr-8"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button
          onClick={clearSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
