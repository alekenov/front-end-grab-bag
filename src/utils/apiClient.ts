
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ApiRequestOptions {
  method?: string;
  requiresAuth?: boolean;
  fallbackData?: any;
  headers?: Record<string, string>;
  body?: any;
}

const API_BASE_URL = "https://xcheceveynzdugmgwrmi.supabase.co";

/**
 * Универсальный клиент для отправки запросов к API
 */
export const apiClient = {
  /**
   * Отправка GET запроса
   * @param endpoint Эндпоинт API
   * @param options Дополнительные опции запроса
   * @returns Promise с результатом запроса
   */
  async get<T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    return this.sendRequest<T>(endpoint, { ...options, method: 'GET' });
  },

  /**
   * Отправка POST запроса
   * @param endpoint Эндпоинт API
   * @param options Дополнительные опции запроса
   * @returns Promise с результатом запроса
   */
  async post<T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    return this.sendRequest<T>(endpoint, { ...options, method: 'POST' });
  },

  /**
   * Отправка PUT запроса
   * @param endpoint Эндпоинт API
   * @param options Дополнительные опции запроса
   * @returns Promise с результатом запроса
   */
  async put<T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    return this.sendRequest<T>(endpoint, { ...options, method: 'PUT' });
  },

  /**
   * Отправка DELETE запроса
   * @param endpoint Эндпоинт API
   * @param options Дополнительные опции запроса
   * @returns Promise с результатом запроса
   */
  async delete<T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    return this.sendRequest<T>(endpoint, { ...options, method: 'DELETE' });
  },

  /**
   * Внутренний метод для отправки запросов
   * @param endpoint Эндпоинт API
   * @param options Опции запроса
   * @returns Promise с результатом запроса
   */
  async sendRequest<T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const {
      method = 'GET',
      requiresAuth = true,
      fallbackData,
      headers = {},
      body
    } = options;

    try {
      // Формируем базовые заголовки
      const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers
      };

      // Добавляем заголовки авторизации из Supabase клиента
      // Получаем текущий токен из сессии
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        requestHeaders['Authorization'] = `Bearer ${session.access_token}`;
      } else if (requiresAuth) {
        // Для отладки используем anon key, так как у нас нет аутентификации
        requestHeaders['Authorization'] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjaGVjZXZleW56ZHVnbWd3cm1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMTI3NTQsImV4cCI6MjA2MTY4ODc1NH0.EtTP-fNb5UrCs6nB_O8mds8oTTBJCeWh1CmfmzDiuds`;
      }

      // Формируем URL с учетом API_BASE_URL
      let url = endpoint;
      if (!endpoint.startsWith('http')) {
        url = `${API_BASE_URL}/functions/v1/${endpoint}`;
      }

      console.info("API запрос:", method, url);

      const requestOptions: RequestInit = {
        method,
        headers: requestHeaders,
        credentials: 'include'
      };

      if (body) {
        requestOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, requestOptions);

      console.info("API ответ:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API ошибка:", errorData);
        throw new Error(`${errorData.message || response.statusText}`);
      }

      // Проверяем, есть ли данные в ответе (для правильной обработки 204 No Content)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return {} as T;
      }
    } catch (error) {
      console.error("API ошибка:", error);

      if (fallbackData !== undefined) {
        console.warn("Используются резервные данные из-за ошибки API");
        return fallbackData as T;
      }

      throw error;
    }
  }
};
