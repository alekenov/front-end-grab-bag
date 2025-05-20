
import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { ProductFilter } from "./ProductFilter";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Grid2X2, ListFilter } from "lucide-react";
import { useProductsSearch } from "@/hooks/products/useProductsSearch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ProductsGridProps {
  onDelete?: (id: string) => void;
  onUpdate?: (product: Product) => void;
  inChatMode?: boolean;
}

export function ProductsGrid({ onDelete, onUpdate, inChatMode = false }: ProductsGridProps) {
  const {
    products: filteredProducts,
    isLoading,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    priceRange,
    setPriceRange,
    categories,
    priceStats
  } = useProductsSearch();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <p>Загрузка товаров...</p>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-500">
        <p className="text-center">Товары не найдены</p>
        <p className="text-center text-sm mt-2">
          {searchQuery || categoryFilter || priceRange.min || priceRange.max
            ? "Попробуйте изменить параметры поиска"
            : "Добавьте новый товар, нажав на кнопку «+»"}
        </p>
      </div>
    );
  }

  // Безопасно преобразуем categories к строковому массиву
  const categoriesArray: string[] = Array.isArray(categories) 
    ? categories.map(category => String(category || ''))
    : [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {/* Мобильная версия фильтров */}
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <ListFilter className="h-4 w-4 mr-2" />
                  Фильтры
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Фильтры</SheetTitle>
                  <SheetDescription>
                    Выберите параметры для фильтрации товаров
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <ProductFilter
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={setCategoryFilter}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    categories={categoriesArray}
                    priceStats={priceStats}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Переключение режима отображения */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            <Grid2X2 className="h-4 w-4 mr-2" />
            {viewMode === "grid" ? "Список" : "Сетка"}
          </Button>
        </div>
        
        <div className="text-sm text-gray-500">
          {filteredProducts.length} {filteredProducts.length === 1 ? "товар" : filteredProducts.length < 5 ? "товара" : "товаров"}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Десктопная версия фильтров */}
        <div className="hidden sm:block w-full md:w-64 shrink-0">
          <ProductFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            categories={categoriesArray}
            priceStats={priceStats}
          />
        </div>

        {/* Список товаров */}
        <div className="flex-1">
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                : "space-y-3"
            }
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={onDelete}
                onUpdate={onUpdate}
                inChatMode={inChatMode}
                viewMode={viewMode}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
