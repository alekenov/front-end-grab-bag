
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat";

// URL Edge Function API
export const CHAT_API_URL = "https://dkohweivbdwweyvyvcbc.supabase.co/functions/v1/chat-api";

// Utility function to parse product data
export const parseProductData = (productData: any) => {
  // If productData is a string, try to parse it
  const data = typeof productData === 'string'
    ? JSON.parse(productData)
    : productData;
  
  // Verify the data has the required structure
  if (data && 
      typeof data === 'object' && 
      'id' in data && 
      'imageUrl' in data && 
      'price' in data) {
    
    return {
      id: String(data.id),
      imageUrl: String(data.imageUrl),
      price: Number(data.price)
    };
  }
  
  return null;
};

// Get current auth session - Fixed to handle anonymous access 
export const getAuthSession = async () => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    // Use anon key as fallback if no session
    const accessToken = sessionData?.session?.access_token || 
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrb2h3ZWl2YmR3d2V5dnl2Y2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1NjU4OTYsImV4cCI6MjA0OTE0MTg5Nn0.5mQbONpvpBmRkwYO8ZSxnRupYAQ36USXIZWeQxKQLxs';
    
    return {
      accessToken,
      session: sessionData?.session
    };
  } catch (error) {
    console.error('Error getting auth session:', error);
    // Return anon key as fallback
    return {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrb2h3ZWl2YmR3d2V5dnl2Y2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1NjU4OTYsImV4cCI6MjA0OTE0MTg5Nn0.5mQbONpvpBmRkwYO8ZSxnRupYAQ36USXIZWeQxKQLxs',
      session: null
    };
  }
};

// Format message from Supabase response
export const formatSupabaseMessage = (msg: any): Message => {
  const result: Message = {
    id: msg.id,
    content: msg.content || "",
    role: msg.is_from_user ? "USER" : "BOT",
    timestamp: msg.created_at || new Date().toISOString()
  };
  
  // Add product data if available
  if (msg.has_product && msg.product_data) {
    const productData = parseProductData(msg.product_data);
    if (productData) {
      result.product = productData;
    }
  }
  
  return result;
};
