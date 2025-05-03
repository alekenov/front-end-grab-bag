
import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { apiClient, ApiRequestOptions } from "@/utils/apiClient";
import { useToast } from "@/hooks/use-toast";

/**
 * Параметры для хука useApiQuery
 */
interface UseApiQueryParams<TData = unknown> {
  endpoint: string;
  enabled?: boolean;
  options?: Omit<ApiRequestOptions, 'method'>;
  queryOptions?: Omit<UseQueryOptions<TData, Error, TData>, 'queryKey' | 'queryFn'>;
  queryKey?: string[];
  errorMessage?: string;
}

/**
 * Хук для выполнения GET запросов к API с интеграцией React Query
 */
export function useApiQuery<TData = unknown>({
  endpoint,
  enabled = true,
  options = {},
  queryOptions = {},
  queryKey,
  errorMessage = "Ошибка загрузки данных"
}: UseApiQueryParams<TData>): UseQueryResult<TData, Error> {
  const { toast } = useToast();
  
  // Формируем ключ запроса на основе эндпоинта, если не предоставлен
  const finalQueryKey = queryKey || ['api', endpoint];
  
  return useQuery({
    queryKey: finalQueryKey,
    queryFn: async () => {
      try {
        return await apiClient.get<TData>(endpoint, options);
      } catch (error) {
        console.error(`Ошибка GET запроса к ${endpoint}:`, error);
        throw error;
      }
    },
    enabled,
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: errorMessage || error.message,
      });
      
      if (queryOptions.onError) {
        queryOptions.onError(error);
      }
    },
    ...queryOptions
  });
}
