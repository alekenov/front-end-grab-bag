
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "./utils.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace("/orders-api", "");
    
    // GET /orders - List all orders
    if (req.method === "GET" && path === "/orders") {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          items:order_items(*)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      return new Response(JSON.stringify({ orders: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // GET /orders/:id - Get a specific order
    if (req.method === "GET" && path.match(/^\/orders\/[a-zA-Z0-9-]+$/)) {
      const id = path.split("/")[2];
      
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();
        
      if (orderError) throw orderError;
      
      // Get order items
      const { data: items, error: itemsError } = await supabase
        .from("order_items")
        .select(`
          *,
          product:products(*)
        `)
        .eq("order_id", id);
        
      if (itemsError) throw itemsError;
      
      // Format order items to include product details
      const formattedItems = items.map(item => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.product?.name || "Unknown Product",
        product_image: item.product?.image_url || null,
        quantity: item.quantity,
        price: item.price
      }));
      
      return new Response(JSON.stringify({ 
        order: { ...order, items: formattedItems } 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // POST /orders - Create a new order
    if (req.method === "POST" && path === "/orders") {
      const { customer_name, customer_phone, customer_id, chat_id, items, delivery_address, delivery_date, comment } = await req.json();
      
      // Start a transaction
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name,
          customer_phone,
          customer_id,
          chat_id,
          delivery_address,
          delivery_date,
          comment,
          status: "new",
          payment_status: "pending",
          total_amount: 0, // Will be updated by trigger
        })
        .select()
        .single();
        
      if (orderError) throw orderError;
      
      // Insert order items
      if (items && items.length > 0) {
        const orderItems = items.map(item => ({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        }));
        
        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems);
          
        if (itemsError) throw itemsError;
      }
      
      return new Response(JSON.stringify({ order }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 201,
      });
    }

    // PATCH /orders/:id - Update an order
    if (req.method === "PATCH" && path.match(/^\/orders\/[a-zA-Z0-9-]+$/)) {
      const id = path.split("/")[2];
      const updates = await req.json();
      
      const { data, error } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
        
      if (error) throw error;
      
      return new Response(JSON.stringify({ order: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // DELETE /orders/:id - Delete an order
    if (req.method === "DELETE" && path.match(/^\/orders\/[a-zA-Z0-9-]+$/)) {
      const id = path.split("/")[2];
      
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // If no route matches
    return new Response(JSON.stringify({ error: "Not Found" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 404,
    });
    
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
