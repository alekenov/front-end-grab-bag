import { supabase } from "@/integrations/supabase/client";
import { getApiUrl } from "./apiHelpers";
import { ANON_TOKEN } from "@/hooks/chat/chatApiUtils";

// Типы для API-запросов
export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiRequestOptions {
  method?: ApiMethod;
  headers?: Record<string, string>;
  body?: any;
  requiresAuth?: boolean;
  fallbackData?: any;
  timeoutMs?: number;
}

// Интерфейс для API клиента со всеми методами
export interface ApiClient {
  request<T>(endpoint: string, options?: ApiRequestOptions): Promise<T>;
  get<T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T>;
  post<T>(endpoint: string, body: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T>;
  put<T>(endpoint: string, body: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T>;
  delete<T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<T>;
}

// Базовый URL API
const API_BASE_URL = getApiUrl();

/**
 * Универсальный API клиент для выполнения запросов к бэкенду
 * Автоматически обрабатывает авторизацию, ошибки и таймауты
 */
export const apiClient: ApiClient = {
  /**
   * Выполняет запрос к API с обработкой ошибок и авторизацией
   */
  async request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      requiresAuth = true,
      fallbackData,
      timeoutMs = 10000
    } = options;

    try {
      // Добавляем слеш в начало пути, если его нет
      const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      const url = `${API_BASE_URL}${path}`;
      
      console.log(`[DEBUG] API запрос: ${method} ${url}`, { 
        headers: { ...headers, Authorization: requiresAuth ? '***' : undefined },
        body: body ? '***' : undefined
      });
      
      // Создаем заголовки
      const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers
      };

      // Добавляем токен авторизации, если требуется
      if (requiresAuth) {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token || ANON_TOKEN;
        
        if (token) {
          requestHeaders['Authorization'] = `Bearer ${token}`;
        } else {
          console.warn('[DEBUG] Отсутствует токен авторизации для запроса, требующего авторизацию');
        }
      }
      
      // Настраиваем таймаут запроса
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      // Выполняем запрос
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      // Логируем ответ
      console.log(`[DEBUG] API ответ: ${response.status} ${response.statusText} для ${url}`);
      
      // Обрабатываем ошибки HTTP
      if (!response.ok) {
        let errorMessage = `Ошибка API: ${response.status} ${response.statusText}`;
        let errorData: Record<string, any> = {};
        
        try {
          errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // Игнорируем ошибку парсинга JSON
          console.log('[DEBUG] Не удалось парсить JSON из ответа ошибки', e);
        }
        
        console.error(`[DEBUG] Детали ошибки API: ${errorMessage}`, errorData);
        throw new Error(errorMessage);
      }

      // Парсим ответ
      const text = await response.text();
      const data = text ? JSON.parse(text) as T : (fallbackData as T);
      
      return data;
    } catch (error) {
      console.error('[DEBUG] API ошибка:', error);
      
      // Если есть резервные данные, возвращаем их при ошибке
      if (fallbackData !== undefined) {
        console.warn('[DEBUG] Используются резервные данные из-за ошибки API');
        return fallbackData as T;
      }
      
      throw error;
    }
  },

  // Вспомогательные методы для различных типов запросов
  get<T>(endpoint: string, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request(endpoint, { ...options, method: 'GET' }) as Promise<T>;
  },
  
  post<T>(endpoint: string, body: any, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request(endpoint, { ...options, method: 'POST', body }) as Promise<T>;
  },
  
  put<T>(endpoint: string, body: any, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request(endpoint, { ...options, method: 'PUT', body }) as Promise<T>;
  },
  
  delete<T>(endpoint: string, options: Omit<ApiRequestOptions, 'method'> = {}): Promise<T> {
    return this.request(endpoint, { ...options, method: 'DELETE' }) as Promise<T>;
  }
};

/**
 * Хук для проверки состояния авторизации
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    return sessionData?.session?.access_token || null;
  } catch (error) {
    console.error('Ошибка при получении токена авторизации:', error);
    return null;
  }
};
