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
      chats: {
        Row: {
          ai_enabled: boolean | null
          created_at: string | null
          id: string
          name: string
          unread_count: number | null
          updated_at: string | null
        }
        Insert: {
          ai_enabled?: boolean | null
          created_at?: string | null
          id?: string
          name: string
          unread_count?: number | null
          updated_at?: string | null
        }
        Update: {
          ai_enabled?: boolean | null
          created_at?: string | null
          id?: string
          name?: string
          unread_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          content: string | null
          context: Json | null
          created_at: string
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
          created_at?: string
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
          created_at?: string
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
          created_at: string
          first_name: string | null
          id: string
          last_interaction: string | null
          last_name: string | null
          metadata: Json | null
          opt_in: boolean | null
          phone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_interaction?: string | null
          last_name?: string | null
          metadata?: Json | null
          opt_in?: boolean | null
          phone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_interaction?: string | null
          last_name?: string | null
          metadata?: Json | null
          opt_in?: boolean | null
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      faq: {
        Row: {
          answer: string
          created_at: string | null
          id: number
          question: string
          shop_id: string | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: number
          question: string
          shop_id?: string | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: number
          question?: string
          shop_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faq_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shop_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_listings: {
        Row: {
          benefits: string[] | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string
          education_level: string | null
          employment: string | null
          employment_type: string | null
          experience_level: string | null
          id: string
          is_active: boolean | null
          location: string | null
          position: string | null
          requirements: string[] | null
          responsibilities: string[] | null
          salary: string | null
          salary_range: Json | null
          schedule: string | null
          shop_id: string | null
          shop_name: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          benefits?: string[] | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description: string
          education_level?: string | null
          employment?: string | null
          employment_type?: string | null
          experience_level?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          position?: string | null
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary?: string | null
          salary_range?: Json | null
          schedule?: string | null
          shop_id?: string | null
          shop_name?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          benefits?: string[] | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string
          education_level?: string | null
          employment?: string | null
          employment_type?: string | null
          experience_level?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          position?: string | null
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary?: string | null
          salary_range?: Json | null
          schedule?: string | null
          shop_id?: string | null
          shop_name?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_listings_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shop_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          chat_id: string
          content: string
          created_at: string | null
          has_product: boolean | null
          id: string
          is_from_user: boolean | null
          product_data: Json | null
        }
        Insert: {
          chat_id: string
          content: string
          created_at?: string | null
          has_product?: boolean | null
          id?: string
          is_from_user?: boolean | null
          product_data?: Json | null
        }
        Update: {
          chat_id?: string
          content?: string
          created_at?: string | null
          has_product?: boolean | null
          id?: string
          is_from_user?: boolean | null
          product_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_chat"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: number
          order_id: number | null
          price_at_time: number
          product_id: number | null
          quantity: number
        }
        Insert: {
          id?: number
          order_id?: number | null
          price_at_time: number
          product_id?: number | null
          quantity: number
        }
        Update: {
          id?: number
          order_id?: number | null
          price_at_time?: number
          product_id?: number | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          id: number
          status: string | null
          total_amount: number | null
          updated_at: string | null
          user_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: number | null
          content: string
          created_at: string | null
          id: number
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: number | null
          content: string
          created_at?: string | null
          id?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: number | null
          content?: string
          created_at?: string | null
          id?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
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
          quantity: number
        }
        Insert: {
          availability?: boolean | null
          category?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          name: string
          price: number
          quantity?: number
        }
        Update: {
          availability?: boolean | null
          category?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          name?: string
          price?: number
          quantity?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          phone: string | null
          telegram_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          phone?: string | null
          telegram_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          phone?: string | null
          telegram_id?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author: string
          comment: string
          created_at: string | null
          date: string
          id: number
          position: string | null
          rating: number
          response: string | null
          shop_id: string | null
        }
        Insert: {
          author: string
          comment: string
          created_at?: string | null
          date: string
          id?: number
          position?: string | null
          rating: number
          response?: string | null
          shop_id?: string | null
        }
        Update: {
          author?: string
          comment?: string
          created_at?: string | null
          date?: string
          id?: number
          position?: string | null
          rating?: number
          response?: string | null
          shop_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shop_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_profiles: {
        Row: {
          about: string | null
          benefits: string[] | null
          created_at: string | null
          description: string | null
          email: string | null
          employeecount: string | null
          faq: Json | null
          foundedyear: string | null
          fulladdress: string | null
          gallery: string[] | null
          id: string
          location: string | null
          logo: string | null
          name: string
          phone: string | null
          rating: number | null
          review_count: number | null
          reviews: Json | null
          specialties: string[] | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          about?: string | null
          benefits?: string[] | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          employeecount?: string | null
          faq?: Json | null
          foundedyear?: string | null
          fulladdress?: string | null
          gallery?: string[] | null
          id?: string
          location?: string | null
          logo?: string | null
          name: string
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          reviews?: Json | null
          specialties?: string[] | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          about?: string | null
          benefits?: string[] | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          employeecount?: string | null
          faq?: Json | null
          foundedyear?: string | null
          fulladdress?: string | null
          gallery?: string[] | null
          id?: string
          location?: string | null
          logo?: string | null
          name?: string
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          reviews?: Json | null
          specialties?: string[] | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          first_name: string | null
          language_code: string | null
          last_name: string | null
          updated_at: string | null
          user_id: number
          username: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          language_code?: string | null
          last_name?: string | null
          updated_at?: string | null
          user_id: number
          username?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          language_code?: string | null
          last_name?: string | null
          updated_at?: string | null
          user_id?: number
          username?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: number
          last_name: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id: number
          last_name?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      clean_expired_verification_codes: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
      increment_job_view: {
        Args: { job_id: number }
        Returns: undefined
      }
      is_admin: {
        Args: { uid: string }
        Returns: boolean
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
