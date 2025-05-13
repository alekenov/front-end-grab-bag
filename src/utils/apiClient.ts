import { supabase } from "@/integrations/supabase/client";
import { getApiUrl } from "./apiHelpers";
import { ANON_TOKEN } from "@/hooks/chat/chatApiUtils";
import { useToast } from "@/hooks/use-toast";

// Типы для API-запросов
export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiRequestOptions {
  method?: string;
  requiresAuth?: boolean;
  fallbackData?: any;
  headers?: Record<string, string>;
  body?: any;
}

const API_BASE_URL = ""; // относительный базовый путь, проксируется на /api

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
    return this.request(endpoint, { ...options, method: 'GET' });
  },

  /**
   * Отправка POST запроса
   * @param endpoint Эндпоинт API
   * @param body Тело запроса
   * @param options Дополнительные опции запроса
   * @returns Promise с результатом запроса
   */
  async post<T = any>(endpoint: string, body?: any, options: ApiRequestOptions = {}): Promise<T> {
    return this.request(endpoint, { ...options, method: 'POST', body });
  },

  /**
   * Отправка PUT запроса
   * @param endpoint Эндпоинт API
   * @param body Тело запроса
   * @param options Дополнительные опции запроса
   * @returns Promise с результатом запроса
   */
  async put<T = any>(endpoint: string, body?: any, options: ApiRequestOptions = {}): Promise<T> {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  },

  /**
   * Отправка DELETE запроса
   * @param endpoint Эндпоинт API
   * @param options Дополнительные опции запроса
   * @returns Promise с результатом запроса
   */
  async delete<T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  },

  /**
   * Универсальный метод для отправки запросов
   * @param endpoint Эндпоинт API
   * @param options Опции запроса
   * @returns Promise с результатом запроса
   */
  async request<T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const {
      method = 'GET',
      requiresAuth = true,
      fallbackData,
      headers = {},
      body
    } = options;

    try {
      // Добавляем слеш в начало пути, если его нет
      const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      const url = `${API_BASE_URL}${path}`;
      
      console.log(`[DEBUG] API запрос: ${method} ${url}`, { 
        headers: { ...headers, Authorization: requiresAuth ? '***' : undefined },
        body: body ? '***' : undefined
      });
      
      // Формируем базовые заголовки
      const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers
      };

      // Если нужна авторизация, добавляем токен из Supabase
      if (requiresAuth) {
        const session = supabase.auth.getSession();
        const token = session ? await session.then(res => res.data.session?.access_token) : null;
        
        if (token) {
          requestHeaders['Authorization'] = `Bearer ${token}`;
        } else {
          console.warn('[DEBUG] Токен авторизации не найден, используем анонимный доступ');
          requestHeaders['Authorization'] = `Bearer ${ANON_TOKEN}`;
        }
      }

      // Настройки запроса
      const requestOptions: RequestInit = {
        method,
        headers: requestHeaders,
        credentials: 'include'
      };

      // Добавляем тело запроса для методов, которые его поддерживают
      if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
        requestOptions.body = JSON.stringify(body);
      }

      // Выполняем запрос
      const response = await fetch(url, requestOptions);
      
      // Обрабатываем возможные ошибки HTTP
      if (!response.ok) {
        console.error(`[DEBUG] API ошибка HTTP: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }

      // Если ответ пустой, возвращаем успех
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T;
      }

      // Парсим JSON-ответ
      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error('[DEBUG] API ошибка:', error);
      
      // Если есть резервные данные, возвращаем их при ошибке
      if (fallbackData !== undefined) {
        console.log('[DEBUG] Возвращаем резервные данные:', fallbackData);
        return fallbackData as T;
      }
      
      throw error;
    }
  }
};
