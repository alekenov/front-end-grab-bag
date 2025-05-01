
import { useState, useEffect } from "react";
import { Product, NewProduct } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useProducts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Получение списка товаров из Supabase
  const { 
    data: products = [], 
    isLoading 
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;

        // Преобразуем данные в формат, ожидаемый приложением
        return data.map(item => ({
          id: item.id.toString(),
          imageUrl: item.image_url || '',
          price: item.price,
          // Используем условную проверку для created_at или устанавливаем текущую дату
          createdAt: new Date().toISOString(),
        }));
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить список товаров",
          variant: "destructive",
        });
        
        // Используем локальное хранилище как запасной вариант
        const storedProducts = localStorage.getItem("product_list");
        return storedProducts ? JSON.parse(storedProducts) : [];
      }
    }
  });

  // Добавление нового товара
  const addProductMutation = useMutation({
    mutationFn: async (newProduct: NewProduct) => {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          price: newProduct.price,
          name: `Букет за ${newProduct.price} ₸`, // Используем цену как название
          image_url: newProduct.imageUrl,
          availability: true,
        }])
        .select();

      if (error) throw error;
      
      if (data && data[0]) {
        return {
          id: data[0].id.toString(),
          imageUrl: data[0].image_url || '',
          price: data[0].price,
          createdAt: new Date().toISOString(), // Используем текущую дату
        };
      }
      throw new Error('Не удалось добавить товар');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Товар добавлен",
        description: "Новый товар успешно добавлен",
      });
    },
    onError: (error) => {
      console.error('Error adding product:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить товар",
        variant: "destructive",
      });
    }
  });

  // Удаление товара
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', parseInt(id));

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Товар удален",
      });
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить товар",
        variant: "destructive",
      });
    }
  });

  // Функции-обертки для сохранения одинакового API
  const addProduct = (newProduct: NewProduct) => {
    return addProductMutation.mutateAsync(newProduct);
  };

  const deleteProduct = (id: string) => {
    deleteProductMutation.mutate(id);
  };

  return {
    products,
    isLoading: isLoading || addProductMutation.isPending || deleteProductMutation.isPending,
    addProduct,
    deleteProduct,
  };
}
