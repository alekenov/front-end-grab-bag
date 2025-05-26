
import { Product, NewProduct } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { 
  initializeDemoData, 
  isDemoModeEnabled, 
  getDemoProducts, 
  saveDemoProduct, 
  deleteDemoProduct 
} from "@/utils/demoStorage";

// Initialize demo data on module load
initializeDemoData();

/**
 * Hook for working with products API in demo mode
 */
export function useProductsApi() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get products
  const { 
    data: products = [], 
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('[useProductsApi] Getting products');
      
      if (isDemoModeEnabled()) {
        const products = getDemoProducts();
        console.log('[useProductsApi] Demo products returned:', products.length);
        return products;
      }
      
      // Fallback to empty array if not in demo mode
      return [];
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: false
  });

  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: async (newProduct: NewProduct) => {
      console.log('[useProductsApi] Adding product:', newProduct);
      
      if (isDemoModeEnabled()) {
        const products = getDemoProducts();
        const newId = products.length > 0 
          ? (Math.max(...products.map(p => parseInt(p.id))) + 1).toString()
          : "1";
        
        const createdProduct: Product = {
          id: newId,
          imageUrl: newProduct.imageUrl || '',
          name: newProduct.name || `Букет за ${newProduct.price} ₸`,
          price: newProduct.price,
          category: newProduct.category || 'Другое',
          description: newProduct.description || '',
          availability: newProduct.availability !== false,
          quantity: newProduct.quantity || 1,
          createdAt: new Date().toISOString(),
        };
        
        return saveDemoProduct(createdProduct);
      }
      
      throw new Error('Demo mode not enabled');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Товар добавлен",
        description: "Новый товар успешно добавлен",
      });
    },
    onError: (error) => {
      console.error('[useProductsApi] Error adding product:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить товар",
        variant: "destructive",
      });
    }
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async (product: Product) => {
      console.log('[useProductsApi] Updating product:', product);
      
      if (isDemoModeEnabled()) {
        return saveDemoProduct(product);
      }
      
      throw new Error('Demo mode not enabled');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Товар обновлен",
        description: "Изменения успешно сохранены",
      });
    },
    onError: (error) => {
      console.error('[useProductsApi] Error updating product:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить товар",
        variant: "destructive",
      });
    }
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('[useProductsApi] Deleting product:', id);
      
      if (isDemoModeEnabled()) {
        const success = deleteDemoProduct(id);
        if (!success) {
          throw new Error('Failed to delete product');
        }
        return id;
      }
      
      throw new Error('Demo mode not enabled');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Товар удален",
      });
    },
    onError: (error) => {
      console.error('[useProductsApi] Error deleting product:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить товар",
        variant: "destructive",
      });
    }
  });

  // Function wrappers to maintain the same API
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
