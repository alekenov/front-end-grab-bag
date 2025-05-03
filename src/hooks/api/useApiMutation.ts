
import { useMutation, UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { apiClient, ApiRequestOptions } from "@/utils/apiClient";
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
        switch (method) {
          case 'POST':
            return await apiClient.post<TData>(endpoint, variables, options);
          case 'PUT':
            return await apiClient.put<TData>(endpoint, variables, options);
          case 'DELETE':
            return await apiClient.delete<TData>(`${endpoint}${variables ? `/${variables}` : ''}`, options);
          default:
            return await apiClient.post<TData>(endpoint, variables, options);
        }
      } catch (error) {
        console.error(`Ошибка ${method} запроса к ${endpoint}:`, error);
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
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: errorMessage || error.message || "Произошла ошибка",
      });
      
      if (mutationOptions.onError) {
        mutationOptions.onError(error, variables, context);
      }
    }
  });
}
