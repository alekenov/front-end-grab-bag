import { useQuery, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";
import { apiClient, type ApiRequestOptions } from "@/utils/apiClient";
import { useToast } from "@/hooks/use-toast";

/**
 * Параметры для хука useApiQuery
 */
interface UseApiQueryParams<TData = unknown> {
  endpoint: string;
  enabled?: boolean;
  options?: Omit<ApiRequestOptions, 'method'>;
  queryOptions?: Omit<UseQueryOptions<TData, Error>, 'queryKey' | 'queryFn'>;
  queryKey?: string[];
  errorMessage?: string;
  showToast?: boolean;  // Флаг для отображения уведомления об ошибке
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
  showToast = true,  // По умолчанию показывать уведомление
}: UseApiQueryParams<TData>): UseQueryResult<TData, Error> {
  const { toast } = useToast();
  
  // Формируем ключ запроса на основе эндпоинта, если не предоставлен
  const finalQueryKey = queryKey || ['api', endpoint];
  
  return useQuery<TData, Error>({
    queryKey: finalQueryKey,
    queryFn: async () => {
      try {
        // Делаем запрос к API
        return await apiClient.get<TData>(endpoint, options);
      } catch (error) {
        // Более подробное логирование ошибок
        if (error instanceof Error) {
          console.error(`🔴 Ошибка GET запроса к ${endpoint}: ${error.message}`);
        } else {
          console.error(`🔴 Неизвестная ошибка при запросе ${endpoint}:`, error);
        }
        throw error; // Пробрасываем ошибку для обработки в React Query
      }
    },
    enabled,
    retry: 2,  // Настройка количества повторных попыток
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),  // Экспоненциальная задержка между попытками
    ...queryOptions,
  });
}
