
import { Product, NewProduct, SupabaseProduct } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/utils/apiClient";

/**
 * Хук для работы с API товаров
 */
export function useProductsApi() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Получение списка товаров
  const { 
    data: products = [], 
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const response = await apiClient.get<SupabaseProduct[]>('/rest/v1/products', {
          requiresAuth: true,
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Range': '0-99',
            'Prefer': 'count=exact'
          },
          fallbackData: []
        });
        
        // Преобразуем данные в формат, ожидаемый приложением
        return response.map ? response.map((item: SupabaseProduct) => ({
          id: item.id.toString(),
          imageUrl: item.image_url || '',
          name: item.name || `Букет за ${item.price} ₸`,
          price: item.price,
          category: item.category || 'Другое',
          description: item.description || '',
          availability: item.availability !== false,
          quantity: item.quantity || 0,
          createdAt: new Date().toISOString(),
        })) : [];
      } catch (error) {
        console.error('Error fetching products:', error);
        
        // Используем локальное хранилище как запасной вариант
        const storedProducts = localStorage.getItem("product_list");
        return storedProducts ? JSON.parse(storedProducts) : [];
      }
    }
  });

  // Добавление нового товара
  const addProductMutation = useMutation({
    mutationFn: async (newProduct: NewProduct) => {
      const productData = {
        price: newProduct.price,
        name: newProduct.name || `Букет за ${newProduct.price} ₸`,
        image_url: newProduct.imageUrl,
        description: newProduct.description || '',
        category: newProduct.category || 'Другое',
        quantity: newProduct.quantity || 1,
        availability: true,
      };
      
      const result = await apiClient.post('/rest/v1/products', productData, {
        requiresAuth: true,
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Prefer': 'return=representation'
        }
      });
      
      if (result && Array.isArray(result) && result[0]) {
        return {
          id: result[0].id.toString(),
          imageUrl: result[0].image_url || '',
          name: result[0].name || `Букет за ${result[0].price} ₸`,
          price: result[0].price,
          category: result[0].category || 'Другое',
          description: result[0].description || '',
          availability: result[0].availability !== false,
          quantity: result[0].quantity || 0,
          createdAt: new Date().toISOString(),
        } as Product;
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

  // Обновление товара
  const updateProductMutation = useMutation({
    mutationFn: async (product: Product) => {
      const productData = {
        price: product.price,
        name: product.name || `Букет за ${product.price} ₸`,
        image_url: product.imageUrl,
        description: product.description || '',
        category: product.category || 'Другое',
        quantity: product.quantity || 0,
        availability: product.availability !== false,
      };
      
      await apiClient.patch(`/rest/v1/products?id=eq.${product.id}`, productData, {
        requiresAuth: true,
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Prefer': 'return=representation'
        }
      });
      
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Товар обновлен",
        description: "Изменения успешно сохранены",
      });
    },
    onError: (error) => {
      console.error('Error updating product:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить товар",
        variant: "destructive",
      });
    }
  });

  // Удаление товара
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/rest/v1/products?id=eq.${id}`, {
        requiresAuth: true,
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
        }
      });
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

  const updateProduct = (product: Product) => {
    return updateProductMutation.mutateAsync(product);
  };

  const deleteProduct = (id: string) => {
    deleteProductMutation.mutate(id);
  };

  return {
    products,
    isLoading: isLoading || addProductMutation.isPending || updateProductMutation.isPending || deleteProductMutation.isPending,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch
  };
}
