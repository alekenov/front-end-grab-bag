
export const getApiUrl = () => {
  return window.APP_CONFIG?.API_URL || '/api';
};

export async function fetchWithFallback<T>(
  url: string, 
  fallbackData: T, 
  options: RequestInit = {}
): Promise<T> {
  try {
    console.log(`Fetching from: ${url}`);
    const response = await fetch(url, options);
    
    console.log(`Response status: ${response.status}`);
    const responseText = await response.text();
    console.log(`Response body: ${responseText}`);
    
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    
    try {
      return JSON.parse(responseText) as T;
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      return fallbackData;
    }
  } catch (error) {
    console.warn('Using fallback data due to error:', error);
    return fallbackData;
  }
}
