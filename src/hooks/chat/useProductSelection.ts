
import { useState, useCallback, useEffect } from "react";
import { Product } from "@/types/product";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

/**
 * Хук для управления выбором товаров в чат
 */
export function useProductSelection(currentChatId: string | null) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Проверка выбранного товара в localStorage
  useEffect(() => {
    console.log("[useProductSelection] Checking for selected product...");
    const selectedProductJson = localStorage.getItem("selected_product");
    
    if (selectedProductJson && currentChatId) {
      try {
        const product = JSON.parse(selectedProductJson);
        console.log("[useProductSelection] Found product in localStorage:", product);
        setSelectedProduct(product);
        
        // Очищаем localStorage после обработки
        localStorage.removeItem("selected_product");
      } catch (error) {
        console.error("[useProductSelection] Error parsing selected product:", error);
      }
    }
  }, [currentChatId]);

  // Выбор товара
  const selectProduct = useCallback((product: Product) => {
    console.log("[useProductSelection] Selecting product:", product);
    
    if (currentChatId) {
      setSelectedProduct(product);
      
      // Сохраняем в localStorage для обработки
      localStorage.setItem("selected_product", JSON.stringify(product));
      
      toast({
        title: "Товар выбран",
        description: `${product.name || `Букет за ${product.price.toLocaleString()} ₸`} добавлен в чат`,
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Выберите чат для добавления товара",
        variant: "destructive",
      });
    }
  }, [currentChatId, toast]);

  // Обработка выбранного товара
  const processSelectedProduct = useCallback((onSendMessage: (message: string, product?: Product) => void) => {
    if (selectedProduct && currentChatId) {
      const productName = selectedProduct.name || `Букет за ${selectedProduct.price.toLocaleString()} ₸`;
      onSendMessage(productName, selectedProduct);
      
      // Сброс выбранного товара
      setSelectedProduct(null);
      
      // Форсируем обновление кэша
      queryClient.invalidateQueries({ queryKey: ['chats-api'] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['messages', currentChatId] });
      queryClient.invalidateQueries({ queryKey: ['messages-api', currentChatId] });
      
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['chats-api'] });
        queryClient.refetchQueries({ queryKey: ['chats'] });
        queryClient.refetchQueries({ queryKey: ['messages', currentChatId] });
        queryClient.refetchQueries({ queryKey: ['messages-api', currentChatId] });
      }, 300);
    }
  }, [selectedProduct, currentChatId, queryClient]);

  // Очистка выбранного товара
  const clearSelectedProduct = useCallback(() => {
    setSelectedProduct(null);
    localStorage.removeItem("selected_product");
  }, []);

  return {
    selectedProduct,
    selectProduct,
    processSelectedProduct,
    clearSelectedProduct
  };
}
