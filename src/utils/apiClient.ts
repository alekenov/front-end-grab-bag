import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client for direct database access
const supabaseUrl = 'https://xcheceveynzdugmgwrmi.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjaGVjZXZleW56ZHVnbWd3cm1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMTI3NTQsImV4cCI6MjA2MTY4ODc1NH0.EtTP-fNb5UrCs6nB_O8mds8oTTBJCeWh1CmfmzDiuds';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Base URL for API requests
const API_BASE_URL = '/api';

// API Request Options interface
export interface ApiRequestOptions {
  headers?: HeadersInit;
  signal?: AbortSignal;
  cache?: RequestCache;
  requiresAuth?: boolean;  // Add this property
  fallbackData?: any;      // Add this for fallback data
}

// Helper to log API request info
const logRequest = (method: string, endpoint: string, headers: HeadersInit) => {
  console.info('[apiClient]', `${method} ${endpoint}`);
  console.info('[apiClient]', 'Request headers:', headers);
};

// Helper to log API response info
const logResponse = (status: number, headers: Headers) => {
  console.info('[apiClient]', 'Response status:', status);
  console.info('[apiClient]', 'Response headers:', Object.fromEntries(headers.entries()));
};

// Method to determine the authentication token
const getToken = (): string => {
  // Get token from localStorage or other auth state management
  const token = localStorage.getItem('authToken') || supabaseKey;
  
  if (!token) {
    console.info('[apiClient]', 'Using anonymous token');
  }
  
  return token;
};

// Main API client with methods for different HTTP verbs
export const apiClient = {
  async get<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const url = `${API_BASE_URL}/${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': options.requiresAuth !== false ? `Bearer ${getToken()}` : '',
      ...(options.headers || {})
    };
    
    logRequest('GET', url, headers);
    
    const response = await fetch(url, { 
      method: 'GET',
      headers,
      signal: options.signal,
      cache: options.cache
    });
    
    logResponse(response.status, response.headers);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    // Handle fallback data if provided
    if (options.fallbackData !== undefined && !response.ok) {
      return options.fallbackData;
    }
    
    return await response.json() as T;
  },
  
  async post<T>(endpoint: string, data: any, options: ApiRequestOptions = {}): Promise<T> {
    const url = `${API_BASE_URL}/${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': options.requiresAuth !== false ? `Bearer ${getToken()}` : '',
      ...(options.headers || {})
    };
    
    logRequest('POST', url, headers);
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
      signal: options.signal,
      cache: options.cache
    });
    
    logResponse(response.status, response.headers);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    // Handle fallback data if provided
    if (options.fallbackData !== undefined && !response.ok) {
      return options.fallbackData;
    }
    
    return await response.json() as T;
  },
  
  async put<T>(endpoint: string, data: any, options: ApiRequestOptions = {}): Promise<T> {
    const url = `${API_BASE_URL}/${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': options.requiresAuth !== false ? `Bearer ${getToken()}` : '',
      ...(options.headers || {})
    };
    
    logRequest('PUT', url, headers);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
      signal: options.signal,
      cache: options.cache
    });
    
    logResponse(response.status, response.headers);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    // Handle fallback data if provided
    if (options.fallbackData !== undefined && !response.ok) {
      return options.fallbackData;
    }
    
    return await response.json() as T;
  },
  
  async patch<T>(endpoint: string, data: any, options: ApiRequestOptions = {}): Promise<T> {
    const url = `${API_BASE_URL}/${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': options.requiresAuth !== false ? `Bearer ${getToken()}` : '',
      ...(options.headers || {})
    };
    
    logRequest('PATCH', url, headers);
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
      signal: options.signal,
      cache: options.cache
    });
    
    logResponse(response.status, response.headers);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    // Handle fallback data if provided
    if (options.fallbackData !== undefined && !response.ok) {
      return options.fallbackData;
    }
    
    return await response.json() as T;
  },
  
  async delete<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const url = `${API_BASE_URL}/${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': options.requiresAuth !== false ? `Bearer ${getToken()}` : '',
      ...(options.headers || {})
    };
    
    logRequest('DELETE', url, headers);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
      signal: options.signal,
      cache: options.cache
    });
    
    logResponse(response.status, response.headers);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    // Handle fallback data if provided
    if (options.fallbackData !== undefined && !response.ok) {
      return options.fallbackData;
    }
    
    return await response.json() as T;
  }
};

export default apiClient;
