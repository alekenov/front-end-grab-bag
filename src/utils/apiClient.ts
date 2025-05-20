
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client for direct database access
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Base URL for API requests
const API_BASE_URL = '/api';

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
  async get<T>(endpoint: string): Promise<T> {
    const url = `${API_BASE_URL}/${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    };
    
    logRequest('GET', url, headers);
    
    const response = await fetch(url, { 
      method: 'GET',
      headers 
    });
    
    logResponse(response.status, response.headers);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json() as T;
  },
  
  async post<T>(endpoint: string, data: any): Promise<T> {
    const url = `${API_BASE_URL}/${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    };
    
    logRequest('POST', url, headers);
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    
    logResponse(response.status, response.headers);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json() as T;
  },
  
  async put<T>(endpoint: string, data: any): Promise<T> {
    const url = `${API_BASE_URL}/${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    };
    
    logRequest('PUT', url, headers);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });
    
    logResponse(response.status, response.headers);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json() as T;
  },
  
  async patch<T>(endpoint: string, data: any): Promise<T> {
    const url = `${API_BASE_URL}/${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    };
    
    logRequest('PATCH', url, headers);
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data)
    });
    
    logResponse(response.status, response.headers);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json() as T;
  },
  
  async delete<T>(endpoint: string): Promise<T> {
    const url = `${API_BASE_URL}/${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    };
    
    logRequest('DELETE', url, headers);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers
    });
    
    logResponse(response.status, response.headers);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json() as T;
  }
};

export default apiClient;
