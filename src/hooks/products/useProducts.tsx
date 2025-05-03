
import { Product, NewProduct } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/utils/apiClient";

/**
 * Хук для работы с товарами через унифицированный API
 */
export function useProducts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Получение списка товаров
  const { 
    data: products = [], 
    isLoading: isLoadingProducts,
    error: productsError,
    refetch: refetchProducts
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        // Используем Supabase напрямую для получения товаров
        const { data, error } = await apiClient.request('/rest/v1/products', {
          method: 'GET',
          requiresAuth: true,
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Range': '0-99'
          }
        });
        
        if (error) throw error;

        // Преобразуем данные в формат, ожидаемый приложением
        return data.map((item: any) => ({
          id: item.id.toString(),
          imageUrl: item.image_url || '',
          price: item.price,
          createdAt: new Date().toISOString(),
        })) as Product[];
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
        name: `Букет за ${newProduct.price} ₸`,
        image_url: newProduct.imageUrl,
        availability: true,
      };
      
      const result = await apiClient.request('/rest/v1/products', {
        method: 'POST',
        body: productData,
        requiresAuth: true,
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Prefer': 'return=representation'
        }
      });
      
      if (result && result[0]) {
        return {
          id: result[0].id.toString(),
          imageUrl: result[0].image_url || '',
          price: result[0].price,
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

  // Удаление товара
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.request(`/rest/v1/products?id=eq.${id}`, {
        method: 'DELETE',
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

  const deleteProduct = (id: string) => {
    deleteProductMutation.mutate(id);
  };

  return {
    products,
    isLoading: isLoadingProducts || addProductMutation.isPending || deleteProductMutation.isPending,
    error: productsError,
    addProduct,
    deleteProduct,
    refetch: refetchProducts
  };
}
