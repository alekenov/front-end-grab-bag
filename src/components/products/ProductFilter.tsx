
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, X } from "lucide-react";

interface PriceRange {
  min: number | null;
  max: number | null;
}

interface ProductFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
  priceRange: PriceRange;
  setPriceRange: (range: PriceRange) => void;
  categories: string[];
  priceStats: {
    min: number;
    max: number;
  };
}

export function ProductFilter({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  priceRange,
  setPriceRange,
  categories,
  priceStats,
}: ProductFilterProps) {
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([
    priceRange.min || priceStats.min,
    priceRange.max || priceStats.max,
  ]);

  // Обновляем локальный диапазон цен при изменении статистики цен
  useEffect(() => {
    setLocalPriceRange([
      priceRange.min || priceStats.min,
      priceRange.max || priceStats.max,
    ]);
  }, [priceStats.min, priceStats.max, priceRange]);

  // Очистка всех фильтров
  const handleClearFilters = () => {
    setSearchQuery("");
    setCategoryFilter(null);
    setPriceRange({ min: null, max: null });
    setLocalPriceRange([priceStats.min, priceStats.max]);
  };

  // Обработчик изменения диапазона цен
  const handlePriceRangeChange = (values: number[]) => {
    setLocalPriceRange([values[0], values[1]]);
  };

  // Применение фильтра цен при отпускании слайдера
  const handlePriceRangeCommit = () => {
    setPriceRange({
      min: localPriceRange[0],
      max: localPriceRange[1],
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4 border border-gray-100">
      {/* Поиск */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Поиск по названию или цене..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Фильтр по категории */}
      <div className="space-y-2">
        <Label htmlFor="category-filter">Категория</Label>
        <Select
          value={categoryFilter || "all"}
          onValueChange={(value) => setCategoryFilter(value === "all" ? null : value)}
        >
          <SelectTrigger id="category-filter">
            <SelectValue placeholder="Все категории" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Фильтр по цене */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Диапазон цен</Label>
          <div className="text-sm text-gray-500">
            {localPriceRange[0].toLocaleString()} ₸ - {localPriceRange[1].toLocaleString()} ₸
          </div>
        </div>
        
        <Slider
          defaultValue={[priceStats.min, priceStats.max]}
          min={priceStats.min}
          max={priceStats.max}
          step={100}
          value={localPriceRange}
          onValueChange={handlePriceRangeChange}
          onValueCommit={handlePriceRangeCommit}
          className="py-4"
        />
      </div>

      {/* Кнопка очистки фильтров */}
      <div className="pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearFilters}
          className="w-full flex items-center justify-center"
        >
          <X className="mr-2 h-4 w-4" />
          Очистить фильтры
        </Button>
      </div>
    </div>
  );
}
