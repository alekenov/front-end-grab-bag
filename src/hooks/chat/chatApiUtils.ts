
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

// Get current auth session
export const getAuthSession = async () => {
  const { data: sessionData } = await supabase.auth.getSession();
  return {
    accessToken: sessionData?.session?.access_token || '',
    session: sessionData?.session
  };
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
