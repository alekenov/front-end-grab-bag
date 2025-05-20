export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_logs: {
        Row: {
          created_at: string | null
          endpoint: string
          id: number
          request: Json | null
          response: Json | null
          status: number | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: number
          request?: Json | null
          response?: Json | null
          status?: number | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: number
          request?: Json | null
          response?: Json | null
          status?: number | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      category_chunks: {
        Row: {
          category_id: number
          created_at: string | null
          embedding: string | null
          id: number
          text_chunk: string
        }
        Insert: {
          category_id: number
          created_at?: string | null
          embedding?: string | null
          id?: number
          text_chunk: string
        }
        Update: {
          category_id?: number
          created_at?: string | null
          embedding?: string | null
          id?: number
          text_chunk?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_chunks_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_customers: {
        Row: {
          chat_id: string | null
          created_at: string | null
          customer_id: string | null
          id: string
        }
        Insert: {
          chat_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
        }
        Update: {
          chat_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_customers_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_customers_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "telegram_chats_mapping"
            referencedColumns: ["chat_uuid"]
          },
          {
            foreignKeyName: "chat_customers_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          ai_enabled: boolean | null
          context: string | null
          created_at: string | null
          customer_id: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          ai_enabled?: boolean | null
          context?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          ai_enabled?: boolean | null
          context?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      chat_tags: {
        Row: {
          chat_id: string
          created_at: string | null
          id: string
          tag_id: string
        }
        Insert: {
          chat_id: string
          created_at?: string | null
          id?: string
          tag_id: string
        }
        Update: {
          chat_id?: string
          created_at?: string | null
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_tags_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_tags_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "telegram_chats_mapping"
            referencedColumns: ["chat_uuid"]
          },
          {
            foreignKeyName: "chat_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          ai_enabled: boolean | null
          channel_id: string | null
          channel_type: string | null
          created_at: string | null
          id: string
          name: string
          phone_number: string | null
          source: string | null
          unread_count: number | null
          updated_at: string | null
        }
        Insert: {
          ai_enabled?: boolean | null
          channel_id?: string | null
          channel_type?: string | null
          created_at?: string | null
          id?: string
          name: string
          phone_number?: string | null
          source?: string | null
          unread_count?: number | null
          updated_at?: string | null
        }
        Update: {
          ai_enabled?: boolean | null
          channel_id?: string | null
          channel_type?: string | null
          created_at?: string | null
          id?: string
          name?: string
          phone_number?: string | null
          source?: string | null
          unread_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      conversation_history: {
        Row: {
          content: string
          created_at: string | null
          customer_id: string | null
          id: string
          metadata: Json | null
          role: string
          session_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          customer_id?: string | null
          id?: string
          metadata?: Json | null
          role: string
          session_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          customer_id?: string | null
          id?: string
          metadata?: Json | null
          role?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_history_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          content: string | null
          context: Json | null
          created_at: string | null
          customer_id: string | null
          direction: string
          id: string
          message_id: string | null
          message_type: string
          metadata: Json | null
          session_id: string | null
        }
        Insert: {
          content?: string | null
          context?: Json | null
          created_at?: string | null
          customer_id?: string | null
          direction: string
          id?: string
          message_id?: string | null
          message_type: string
          metadata?: Json | null
          session_id?: string | null
        }
        Update: {
          content?: string | null
          context?: Json | null
          created_at?: string | null
          customer_id?: string | null
          direction?: string
          id?: string
          message_id?: string | null
          message_type?: string
          metadata?: Json | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          last_interaction: string | null
          last_name: string | null
          metadata: Json | null
          opt_in: boolean | null
          phone: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_interaction?: string | null
          last_name?: string | null
          metadata?: Json | null
          opt_in?: boolean | null
          phone: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_interaction?: string | null
          last_name?: string | null
          metadata?: Json | null
          opt_in?: boolean | null
          phone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      customers_old: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          phone_number: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          name?: string | null
          phone_number: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          phone_number?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      example_categories: {
        Row: {
          created_at: number | null
          description: string | null
          id: string
          name: string | null
          updated_at: number | null
        }
        Insert: {
          created_at?: number | null
          description?: string | null
          id?: string
          name?: string | null
          updated_at?: number | null
        }
        Update: {
          created_at?: number | null
          description?: string | null
          id?: string
          name?: string | null
          updated_at?: number | null
        }
        Relationships: []
      }
      facebook_events: {
        Row: {
          error_details: Json | null
          event_data: Json
          event_type: string
          id: string
          message_content: string | null
          message_id: string | null
          processed: boolean | null
          processed_at: string | null
          received_at: string | null
          request_id: string | null
          sender_id: string | null
          status: string | null
        }
        Insert: {
          error_details?: Json | null
          event_data: Json
          event_type: string
          id?: string
          message_content?: string | null
          message_id?: string | null
          processed?: boolean | null
          processed_at?: string | null
          received_at?: string | null
          request_id?: string | null
          sender_id?: string | null
          status?: string | null
        }
        Update: {
          error_details?: Json | null
          event_data?: Json
          event_type?: string
          id?: string
          message_content?: string | null
          message_id?: string | null
          processed?: boolean | null
          processed_at?: string | null
          received_at?: string | null
          request_id?: string | null
          sender_id?: string | null
          status?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          chat_id: string | null
          content: string
          created_at: string | null
          has_product: boolean | null
          id: string
          is_from_user: boolean | null
          product_data: Json | null
          source: string | null
        }
        Insert: {
          chat_id?: string | null
          content: string
          created_at?: string | null
          has_product?: boolean | null
          id?: string
          is_from_user?: boolean | null
          product_data?: Json | null
          source?: string | null
        }
        Update: {
          chat_id?: string | null
          content?: string
          created_at?: string | null
          has_product?: boolean | null
          id?: string
          is_from_user?: boolean | null
          product_data?: Json | null
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "telegram_chats_mapping"
            referencedColumns: ["chat_uuid"]
          },
        ]
      }
      products: {
        Row: {
          availability: boolean | null
          category: string | null
          description: string | null
          id: number
          image_url: string | null
          name: string
          price: number
          quantity: number | null
          search_vector: unknown | null
        }
        Insert: {
          availability?: boolean | null
          category?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          name: string
          price: number
          quantity?: number | null
          search_vector?: unknown | null
        }
        Update: {
          availability?: boolean | null
          category?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          name?: string
          price?: number
          quantity?: number | null
          search_vector?: unknown | null
        }
        Relationships: []
      }
      raw_messages: {
        Row: {
          content: string | null
          created_at: string | null
          message_id: string
          message_type: string | null
          phone_number: string | null
          response: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          message_id?: string
          message_type?: string | null
          phone_number?: string | null
          response?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          message_id?: string
          message_type?: string | null
          phone_number?: string | null
          response?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          ai_enabled: number | null
          context: string | null
          created_at: string | null
          customer_id: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          ai_enabled?: number | null
          context?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          ai_enabled?: number | null
          context?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      telegram_events: {
        Row: {
          created_at: string
          error_details: Json | null
          event_data: Json
          event_type: string
          id: string
          message_content: string | null
          message_id: string | null
          processed: boolean | null
          processed_at: string | null
          received_at: string
          request_id: string | null
          sender_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          error_details?: Json | null
          event_data?: Json
          event_type: string
          id?: string
          message_content?: string | null
          message_id?: string | null
          processed?: boolean | null
          processed_at?: string | null
          received_at?: string
          request_id?: string | null
          sender_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          error_details?: Json | null
          event_data?: Json
          event_type?: string
          id?: string
          message_content?: string | null
          message_id?: string | null
          processed?: boolean | null
          processed_at?: string | null
          received_at?: string
          request_id?: string | null
          sender_id?: string | null
          status?: string | null
        }
        Relationships: []
      }
      telegram_messages: {
        Row: {
          chat_id: string
          content: string
          created_at: string
          id: string
          is_from_user: boolean
          metadata: Json | null
          telegram_chat_id: string
          telegram_message_id: string | null
        }
        Insert: {
          chat_id: string
          content: string
          created_at?: string
          id?: string
          is_from_user?: boolean
          metadata?: Json | null
          telegram_chat_id: string
          telegram_message_id?: string | null
        }
        Update: {
          chat_id?: string
          content?: string
          created_at?: string
          id?: string
          is_from_user?: boolean
          metadata?: Json | null
          telegram_chat_id?: string
          telegram_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "telegram_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "telegram_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "telegram_chats_mapping"
            referencedColumns: ["chat_uuid"]
          },
        ]
      }
      training_examples: {
        Row: {
          category_id: string | null
          created_at: number | null
          enabled: number | null
          id: string
          query: string | null
          response: string | null
          tags: string | null
          updated_at: number | null
        }
        Insert: {
          category_id?: string | null
          created_at?: number | null
          enabled?: number | null
          id?: string
          query?: string | null
          response?: string | null
          tags?: string | null
          updated_at?: number | null
        }
        Update: {
          category_id?: string | null
          created_at?: number | null
          enabled?: number | null
          id?: string
          query?: string | null
          response?: string | null
          tags?: string | null
          updated_at?: number | null
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          event_type: string
          id: number
          payload: Json | null
          processed_at: string | null
          source: string
          success: boolean | null
        }
        Insert: {
          event_type: string
          id?: number
          payload?: Json | null
          processed_at?: string | null
          source: string
          success?: boolean | null
        }
        Update: {
          event_type?: string
          id?: number
          payload?: Json | null
          processed_at?: string | null
          source?: string
          success?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      all_messages: {
        Row: {
          chat_id: string | null
          content: string | null
          created_at: string | null
          has_product: boolean | null
          id: string | null
          is_from_user: boolean | null
          product_data: Json | null
          source: string | null
        }
        Relationships: []
      }
      telegram_chats_mapping: {
        Row: {
          chat_uuid: string | null
          name: string | null
          telegram_chat_id: string | null
        }
        Insert: {
          chat_uuid?: string | null
          name?: string | null
          telegram_chat_id?: string | null
        }
        Update: {
          chat_uuid?: string | null
          name?: string | null
          telegram_chat_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      api_sync_telegram_messages: {
        Args: { p_telegram_id?: string; p_chat_uuid?: string }
        Returns: {
          chat_id: string | null
          content: string
          created_at: string | null
          has_product: boolean | null
          id: string
          is_from_user: boolean | null
          product_data: Json | null
          source: string | null
        }[]
      }
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      check_if_telegram_events_table_exists: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_chats_with_last_messages: {
        Args:
          | Record<PropertyKey, never>
          | { p_limit?: number; p_offset?: number }
        Returns: {
          id: string
          name: string
          source: string
          ai_enabled: boolean
          unread_count: number
          created_at: string
          updated_at: string
          last_message_content: string
          last_message_created_at: string
          last_message_is_from_user: boolean
        }[]
      }
      get_chats_with_tags: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: {
          id: string
          name: string
          source: string
          ai_enabled: boolean
          unread_count: number
          created_at: string
          updated_at: string
          last_message_content: string
          last_message_timestamp: string
          last_message_has_product: boolean
          last_message_product_price: number
          tags: Json
        }[]
      }
      get_telegram_chat_id: {
        Args: { db_chat_id: string }
        Returns: string
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      increment: {
        Args: { row_id: string; table_name: string; column_name: string }
        Returns: number
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_category_chunks: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: number
          category_id: number
          text_chunk: string
          similarity: number
        }[]
      }
      migrate_conversations_to_chats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      migrate_data_to_supabase_tables: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      process_webhook: {
        Args: { payload: Json }
        Returns: Json
      }
      search_products: {
        Args: { search_query: string }
        Returns: {
          availability: boolean | null
          category: string | null
          description: string | null
          id: number
          image_url: string | null
          name: string
          price: number
          quantity: number | null
          search_vector: unknown | null
        }[]
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      sync_telegram_messages: {
        Args: { telegram_id: string }
        Returns: {
          id: string
          content: string
          is_from_user: boolean
          created_at: string
        }[]
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      verify_webhook: {
        Args: { mode: string; verify_token: string; challenge: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
