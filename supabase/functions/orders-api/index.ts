
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.24.0";
import { corsHeaders } from "./utils.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Обработка CORS preflight запросов
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split("/").filter(Boolean);
    
    // 'orders-api' is the first part of the path
    if (path[0] !== 'orders-api') {
      throw new Error("Неверный маршрут API");
    }
    
    // Orders listing and creation
    if (path.length === 1) {
      // GET orders
      if (req.method === "GET") {
        const { status, dateFrom, dateTo, search, customer_id, chat_id } = Object.fromEntries(url.searchParams);
        
        let query = supabase.from("orders").select(`
          *,
          customers(first_name, last_name, phone)
        `);
        
        // Apply filters
        if (status) query = query.eq("status", status);
        if (dateFrom) query = query.gte("created_at", dateFrom);
        if (dateTo) query = query.lte("created_at", dateTo);
        if (customer_id) query = query.eq("customer_id", customer_id);
        if (chat_id) query = query.eq("chat_id", chat_id);
        if (search) {
          query = query.or(`id.ilike.%${search}%, customers.phone.ilike.%${search}%`);
        }
        
        const { data: orders, error } = await query.order("created_at", { ascending: false });
        
        if (error) throw error;
        
        // Format response for frontend
        const formattedOrders = orders.map(order => ({
          ...order,
          customer_name: order.customers ? 
            `${order.customers.first_name || ''} ${order.customers.last_name || ''}`.trim() : 
            'Неизвестный клиент',
          customer_phone: order.customers?.phone || null
        }));
        
        return new Response(
          JSON.stringify({ orders: formattedOrders }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } 
      // POST new order
      else if (req.method === "POST") {
        const orderData = await req.json();
        
        // Insert new order
        const { data: order, error } = await supabase
          .from("orders")
          .insert(orderData)
          .select()
          .single();
        
        if (error) throw error;
        
        return new Response(
          JSON.stringify({ order }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // Single order operations
    else if (path[1] && path.length === 2) {
      const orderId = path[1];
      
      // GET single order with items
      if (req.method === "GET") {
        // Get order details
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .select(`
            *,
            customers(first_name, last_name, phone)
          `)
          .eq("id", orderId)
          .single();
        
        if (orderError) throw orderError;
        
        // Get order items with product details
        const { data: items, error: itemsError } = await supabase
          .from("order_items")
          .select(`
            *,
            products(name, image_url)
          `)
          .eq("order_id", orderId);
        
        if (itemsError) throw itemsError;
        
        // Format response
        const formattedOrder = {
          ...order,
          customer_name: order.customers ? 
            `${order.customers.first_name || ''} ${order.customers.last_name || ''}`.trim() : 
            'Неизвестный клиент',
          customer_phone: order.customers?.phone || null,
          items: items.map(item => ({
            ...item,
            product_name: item.products?.name || 'Неизвестный товар',
            product_image: item.products?.image_url || null
          }))
        };
        
        return new Response(
          JSON.stringify({ order: formattedOrder }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      // PATCH update order
      else if (req.method === "PATCH") {
        const updates = await req.json();
        
        const { data: order, error } = await supabase
          .from("orders")
          .update(updates)
          .eq("id", orderId)
          .select()
          .single();
        
        if (error) throw error;
        
        return new Response(
          JSON.stringify({ order }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      // DELETE order
      else if (req.method === "DELETE") {
        const { error } = await supabase
          .from("orders")
          .delete()
          .eq("id", orderId);
        
        if (error) throw error;
        
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // Order items operations
    else if (path[1] && path[2] === "items" && path.length === 3) {
      const orderId = path[1];
      
      // Add item to order
      if (req.method === "POST") {
        const itemData = await req.json();
        
        // Get the product price if not provided
        if (!itemData.price && itemData.product_id) {
          const { data: product } = await supabase
            .from("products")
            .select("price")
            .eq("id", itemData.product_id)
            .single();
          
          if (product) {
            itemData.price = product.price;
          }
        }
        
        const { data: item, error } = await supabase
          .from("order_items")
          .insert({ ...itemData, order_id: orderId })
          .select()
          .single();
        
        if (error) throw error;
        
        return new Response(
          JSON.stringify({ item }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // Delete order item
    else if (path[1] && path[2] === "items" && path[3] && path.length === 4) {
      const orderId = path[1];
      const itemId = path[3];
      
      if (req.method === "DELETE") {
        const { error } = await supabase
          .from("order_items")
          .delete()
          .eq("id", itemId)
          .eq("order_id", orderId);
        
        if (error) throw error;
        
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // Get orders by chat ID
    else if (path[1] === "chat" && path[2] && path.length === 3) {
      const chatId = path[2];
      
      if (req.method === "GET") {
        const { data: orders, error } = await supabase
          .from("orders")
          .select(`
            *,
            customers(first_name, last_name, phone)
          `)
          .eq("chat_id", chatId)
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        
        // Format response
        const formattedOrders = orders.map(order => ({
          ...order,
          customer_name: order.customers ? 
            `${order.customers.first_name || ''} ${order.customers.last_name || ''}`.trim() : 
            'Неизвестный клиент',
          customer_phone: order.customers?.phone || null
        }));
        
        return new Response(
          JSON.stringify({ orders: formattedOrders }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    return new Response(
      JSON.stringify({ error: "Неподдерживаемый маршрут API" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Внутренняя ошибка сервера" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
