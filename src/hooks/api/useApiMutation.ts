import { useMutation, type UseMutationOptions, type UseMutationResult } from "@tanstack/react-query";
import { apiClient, type ApiRequestOptions } from "@/utils/apiClient";
import { useToast } from "@/hooks/use-toast";

/**
 * Параметры для хука useApiMutation
 */
interface UseApiMutationParams<TData = unknown, TVariables = unknown> {
  endpoint: string;
  method?: 'POST' | 'PUT' | 'DELETE';
  options?: Omit<ApiRequestOptions, 'method'>;
  mutationOptions?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>;
  successMessage?: string;
  errorMessage?: string;
}

/**
 * Хук для выполнения мутаций API (POST, PUT, DELETE) с интеграцией React Query
 */
export function useApiMutation<TData = unknown, TVariables = unknown>({
  endpoint,
  method = 'POST',
  options = {},
  mutationOptions = {},
  successMessage,
  errorMessage = "Произошла ошибка"
}: UseApiMutationParams<TData, TVariables>): UseMutationResult<TData, Error, TVariables> {
  const { toast } = useToast();

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      try {
        const operationName = method === 'POST' ? 'создания' : method === 'PUT' ? 'обновления' : 'удаления';
        console.log(`📤 Начало операции ${operationName} (${method} запрос к ${endpoint})`);
        
        let result: TData;
        
        switch (method) {
          case 'POST':
            result = await apiClient.post<TData>(endpoint, variables, options);
            break;
          case 'PUT':
            result = await apiClient.put<TData>(endpoint, variables, options);
            break;
          case 'DELETE':
            result = await apiClient.delete<TData>(`${endpoint}${variables ? `/${variables}` : ''}`, options);
            break;
          default:
            result = await apiClient.post<TData>(endpoint, variables, options);
        }
        
        console.log(`✅ Успешное завершение операции ${operationName}`);
        return result;
      } catch (error) {
        // Улучшенное логирование ошибок
        if (error instanceof Error) {
          console.error(`🔴 Ошибка ${method} запроса к ${endpoint}: ${error.message}`);
        } else {
          console.error(`🔴 Неизвестная ошибка ${method} запроса к ${endpoint}:`, error);
        }
        throw error;
      }
    },
    ...mutationOptions,
    onSuccess: (data, variables, context) => {
      if (successMessage) {
        toast({
          title: "Успешно",
          description: successMessage,
        });
      }
      
      if (mutationOptions.onSuccess) {
        mutationOptions.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      // Более детальное сообщение об ошибке
      const errorDetails = error instanceof Error 
        ? error.message 
        : "Неизвестная ошибка";
        
      toast({
        variant: "destructive",
        title: "Ошибка API",
        description: errorMessage || errorDetails || "Произошла ошибка при обращении к серверу",
      });
      
      if (mutationOptions.onError) {
        mutationOptions.onError(error, variables, context);
      }
    }
  });
}
