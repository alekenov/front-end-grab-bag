
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
        const parsedProducts = storedProducts ? JSON.parse(storedProducts) : [];
        
        // Если в localStorage есть данные, используем их
        if (parsedProducts.length > 0) {
          return parsedProducts;
        }
        
        // Если нет данных, возвращаем пустой массив
        return [];
      }
    }
  });

  // Добавление нового товара
  const addProductMutation = useMutation({
    mutationFn: async (newProduct: NewProduct) => {
      try {
        // Создаем объект с данными товара
        const productData = {
          price: newProduct.price,
          name: newProduct.name || `Букет за ${newProduct.price} ₸`,
          image_url: newProduct.imageUrl,
          description: newProduct.description || '',
          category: newProduct.category || 'Другое',
          quantity: newProduct.quantity || 1,
          availability: true,
        };
        
        // Пробуем получить текущие товары из localStorage
        const storedProducts = localStorage.getItem("product_list");
        const currentProducts = storedProducts ? JSON.parse(storedProducts) : [];
        
        // Создаем новый товар
        const newId = currentProducts.length > 0 
          ? Math.max(...currentProducts.map((p: Product) => parseInt(p.id))) + 1 
          : 1;
        
        const createdProduct: Product = {
          id: newId.toString(),
          imageUrl: productData.image_url || '',
          name: productData.name,
          price: productData.price,
          category: productData.category,
          description: productData.description,
          availability: productData.availability,
          quantity: productData.quantity,
          createdAt: new Date().toISOString(),
        };
        
        // Пробуем выполнить API-запрос
        try {
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
        } catch (apiError) {
          console.error('API Error adding product:', apiError);
          // Если API-запрос не удался, записываем в localStorage
          currentProducts.push(createdProduct);
          localStorage.setItem("product_list", JSON.stringify(currentProducts));
          
          return createdProduct;
        }
        
        // Если API не вернул результат, используем локальное хранение
        currentProducts.push(createdProduct);
        localStorage.setItem("product_list", JSON.stringify(currentProducts));
        
        return createdProduct;
      } catch (error) {
        console.error('Error in addProductMutation:', error);
        throw new Error('Не удалось добавить товар');
      }
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
        description: "Не удалось добавить товар: " + (error.message || "неизвестная ошибка"),
        variant: "destructive",
      });
    }
  });

  // Обновление товара
  const updateProductMutation = useMutation({
    mutationFn: async (product: Product) => {
      try {
        const productData = {
          price: product.price,
          name: product.name || `Букет за ${product.price} ₸`,
          image_url: product.imageUrl,
          description: product.description || '',
          category: product.category || 'Другое',
          quantity: product.quantity || 0,
          availability: product.availability !== false,
        };
        
        // Пробуем обновить через API
        try {
          await apiClient.patch(`/rest/v1/products?id=eq.${product.id}`, productData, {
            requiresAuth: true,
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Prefer': 'return=representation'
            }
          });
        } catch (apiError) {
          console.error('API Error updating product:', apiError);
          
          // Если API-запрос не удался, обновляем в localStorage
          const storedProducts = localStorage.getItem("product_list");
          if (storedProducts) {
            const currentProducts = JSON.parse(storedProducts);
            const index = currentProducts.findIndex((p: Product) => p.id === product.id);
            if (index !== -1) {
              currentProducts[index] = {...product};
              localStorage.setItem("product_list", JSON.stringify(currentProducts));
            }
          }
        }
        
        return product;
      } catch (error) {
        console.error('Error in updateProductMutation:', error);
        throw error;
      }
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
        description: "Не удалось обновить товар: " + (error.message || "неизвестная ошибка"),
        variant: "destructive",
      });
    }
  });

  // Удаление товара
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        // Пробуем удалить через API
        try {
          await apiClient.delete(`/rest/v1/products?id=eq.${id}`, {
            requiresAuth: true,
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
            }
          });
        } catch (apiError) {
          console.error('API Error deleting product:', apiError);
          
          // Если API-запрос не удался, удаляем из localStorage
          const storedProducts = localStorage.getItem("product_list");
          if (storedProducts) {
            const currentProducts = JSON.parse(storedProducts);
            const updatedProducts = currentProducts.filter((p: Product) => p.id !== id);
            localStorage.setItem("product_list", JSON.stringify(updatedProducts));
          }
        }
        
        return id;
      } catch (error) {
        console.error('Error in deleteProductMutation:', error);
        throw error;
      }
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
        description: "Не удалось удалить товар: " + (error.message || "неизвестная ошибка"),
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
