
import { useState } from "react";
import { useProductsApi } from "./useProductsApi";
import { Product } from "@/types/product";

export function useProductsSearch() {
  const { products, isLoading, error, refetch } = useProductsApi();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<{min: number | null, max: number | null}>({ 
    min: null, 
    max: null 
  });

  // Фильтрация товаров по поисковому запросу, категории и ценовому диапазону
  const filteredProducts = products.filter(product => {
    // Фильтр по поисковому запросу (проверяем цену как строку для поиска)
    const matchesSearch = searchQuery === "" || 
      product.price.toString().includes(searchQuery) ||
      (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Фильтр по категории (если выбрана)
    const matchesCategory = !categoryFilter || 
      (product.category === categoryFilter);
    
    // Фильтр по ценовому диапазону
    const matchesMinPrice = priceRange.min === null || 
      product.price >= priceRange.min;
    
    const matchesMaxPrice = priceRange.max === null || 
      product.price <= priceRange.max;
    
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  // Извлекаем уникальные категории из данных для фильтров
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  // Находим минимальную и максимальную цены для фильтра
  const minPrice = products.length ? Math.min(...products.map(p => p.price)) : 0;
  const maxPrice = products.length ? Math.max(...products.map(p => p.price)) : 10000;

  return {
    products: filteredProducts,
    isLoading,
    error,
    refetch,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    priceRange,
    setPriceRange,
    categories,
    priceStats: {
      min: minPrice,
      max: maxPrice
    }
  };
}
