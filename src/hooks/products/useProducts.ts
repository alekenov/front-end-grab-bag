
import { useProductsApi } from './useProductsApi';

export function useProducts() {
  const { products, isLoading, error, refetch } = useProductsApi();

  return {
    data: products,
    isLoading,
    error,
    refetch
  };
}
