
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
  fallbackData?: TData;
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
  errorMessage = "Ошибка загрузки данных",
  fallbackData
}: UseApiQueryParams<TData>): UseQueryResult<TData, Error> {
  const { toast } = useToast();
  
  // Формируем ключ запроса на основе эндпоинта, если не предоставлен
  const finalQueryKey = queryKey || ['api', endpoint];
  
  return useQuery<TData, Error>({
    queryKey: finalQueryKey,
    queryFn: async () => {
      try {
        console.log(`[useApiQuery] Выполняем запрос к ${endpoint}`);
        const data = await apiClient.get<TData>(endpoint, options);
        console.log(`[useApiQuery] Результат запроса к ${endpoint}:`, data);
        return data;
      } catch (error) {
        console.error(`[useApiQuery] Ошибка GET запроса к ${endpoint}:`, error);
        throw error;
      }
    },
    enabled,
    ...queryOptions,
    meta: {
      ...queryOptions.meta,
      onError: (error: Error) => {
        console.error(`[useApiQuery] Error in ${endpoint}:`, error);
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: errorMessage || error.message,
        });
      }
    }
  });
}
