export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          data: Json | null
          day: number | null
          id: string
          journey_id: string | null
          source: string
          timestamp: string
          tool_type: string
          user_id: string
        }
        Insert: {
          data?: Json | null
          day?: number | null
          id?: string
          journey_id?: string | null
          source: string
          timestamp?: string
          tool_type: string
          user_id: string
        }
        Update: {
          data?: Json | null
          day?: number | null
          id?: string
          journey_id?: string | null
          source?: string
          timestamp?: string
          tool_type?: string
          user_id?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          qty: number
          tea_key: string
          user_id: string
        }
        Insert: {
          qty: number
          tea_key: string
          user_id: string
        }
        Update: {
          qty?: number
          tea_key?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string
          from_who: string
          id: string
          journey_id: string
          text: string
          user_id: string
        }
        Insert: {
          created_at?: string
          from_who: string
          id?: string
          journey_id: string
          text: string
          user_id: string
        }
        Update: {
          created_at?: string
          from_who?: string
          id?: string
          journey_id?: string
          text?: string
          user_id?: string
        }
        Relationships: []
      }
      diary_entries: {
        Row: {
          created_at: string
          id: string
          journey_day: number | null
          journey_name: string | null
          moods: string[]
          text: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          journey_day?: number | null
          journey_name?: string | null
          moods?: string[]
          text: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          journey_day?: number | null
          journey_name?: string | null
          moods?: string[]
          text?: string
          user_id?: string
        }
        Relationships: []
      }
      flora_usage_daily: {
        Row: {
          messages_used: number
          quota: number
          usage_date: string
          user_id: string
        }
        Insert: {
          messages_used?: number
          quota?: number
          usage_date: string
          user_id: string
        }
        Update: {
          messages_used?: number
          quota?: number
          usage_date?: string
          user_id?: string
        }
        Relationships: []
      }
      garden_unlocks: {
        Row: {
          day: number
          journey_id: string
          key: string
          name: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          day: number
          journey_id: string
          key: string
          name: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          day?: number
          journey_id?: string
          key?: string
          name?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      habit_completions: {
        Row: {
          count: number
          date: string
          habit_id: string
          user_id: string
        }
        Insert: {
          count?: number
          date: string
          habit_id: string
          user_id: string
        }
        Update: {
          count?: number
          date?: string
          habit_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_completions_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          created_at: string
          freq_label: string
          goal: number
          icon: string
          id: string
          name: string
          origin: string | null
          reminder: boolean
          reminder_time: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          freq_label: string
          goal?: number
          icon: string
          id?: string
          name: string
          origin?: string | null
          reminder?: boolean
          reminder_time?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          freq_label?: string
          goal?: number
          icon?: string
          id?: string
          name?: string
          origin?: string | null
          reminder?: boolean
          reminder_time?: string | null
          user_id?: string
        }
        Relationships: []
      }
      melhor_envio_tokens: {
        Row: {
          access_token: string
          expires_at: string
          id: boolean
          refresh_token: string
          updated_at: string
        }
        Insert: {
          access_token: string
          expires_at: string
          id?: boolean
          refresh_token: string
          updated_at?: string
        }
        Update: {
          access_token?: string
          expires_at?: string
          id?: boolean
          refresh_token?: string
          updated_at?: string
        }
        Relationships: []
      }
      mood_checkins: {
        Row: {
          created_at: string
          id: string
          journey_id: string | null
          kit_afirmacao: string | null
          kit_o_que_importa: string | null
          kit_o_que_vem_a_seguir: string | null
          mood: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          journey_id?: string | null
          kit_afirmacao?: string | null
          kit_o_que_importa?: string | null
          kit_o_que_vem_a_seguir?: string | null
          mood: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          journey_id?: string | null
          kit_afirmacao?: string | null
          kit_o_que_importa?: string | null
          kit_o_que_vem_a_seguir?: string | null
          mood?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          checkout_url: string | null
          created_at: string
          id: string
          items: Json
          mp_payment_id: string | null
          mp_preference_id: string | null
          ship_bairro: string | null
          ship_cep: string | null
          ship_cidade: string | null
          ship_complemento: string | null
          ship_numero: string | null
          ship_rua: string | null
          ship_uf: string | null
          shipping_fee: number
          shipping_service: string | null
          status: string
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          checkout_url?: string | null
          created_at?: string
          id?: string
          items: Json
          mp_payment_id?: string | null
          mp_preference_id?: string | null
          ship_bairro?: string | null
          ship_cep?: string | null
          ship_cidade?: string | null
          ship_complemento?: string | null
          ship_numero?: string | null
          ship_rua?: string | null
          ship_uf?: string | null
          shipping_fee?: number
          shipping_service?: string | null
          status?: string
          total: number
          updated_at?: string
          user_id: string
        }
        Update: {
          checkout_url?: string | null
          created_at?: string
          id?: string
          items?: Json
          mp_payment_id?: string | null
          mp_preference_id?: string | null
          ship_bairro?: string | null
          ship_cep?: string | null
          ship_cidade?: string | null
          ship_complemento?: string | null
          ship_numero?: string | null
          ship_rua?: string | null
          ship_uf?: string | null
          shipping_fee?: number
          shipping_service?: string | null
          status?: string
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          endereco_bairro: string | null
          endereco_cep: string | null
          endereco_cidade: string | null
          endereco_complemento: string | null
          endereco_numero: string | null
          endereco_rua: string | null
          endereco_uf: string | null
          id: string
          nome: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          endereco_cidade?: string | null
          endereco_complemento?: string | null
          endereco_numero?: string | null
          endereco_rua?: string | null
          endereco_uf?: string | null
          id: string
          nome?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          endereco_cidade?: string | null
          endereco_complemento?: string | null
          endereco_numero?: string | null
          endereco_rua?: string | null
          endereco_uf?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      redeemed_rewards: {
        Row: {
          redeemed_at: string
          reward_id: string
          user_id: string
        }
        Insert: {
          redeemed_at?: string
          reward_id: string
          user_id: string
        }
        Update: {
          redeemed_at?: string
          reward_id?: string
          user_id?: string
        }
        Relationships: []
      }
      shop_customers: {
        Row: {
          created_at: string
          email: string
          id: string
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      shop_order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_slug: string
          qty: number
          subtotal_cents: number
          unit_price_cents: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          product_slug: string
          qty: number
          subtotal_cents: number
          unit_price_cents: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          product_slug?: string
          qty?: number
          subtotal_cents?: number
          unit_price_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "shop_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "shop_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "shop_products"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_orders: {
        Row: {
          access_token: string
          bairro: string
          cep: string
          cidade: string
          complemento: string | null
          created_at: string
          customer_id: string | null
          email: string
          id: string
          mp_payment_id: string | null
          mp_payment_status: string | null
          mp_preference_id: string | null
          nome: string
          numero: string
          order_number: string
          rua: string
          shipping_fee_cents: number
          shipping_method: string
          status: string
          subtotal_cents: number
          telefone: string
          total_cents: number
          uf: string
          updated_at: string
        }
        Insert: {
          access_token?: string
          bairro: string
          cep: string
          cidade: string
          complemento?: string | null
          created_at?: string
          customer_id?: string | null
          email: string
          id?: string
          mp_payment_id?: string | null
          mp_payment_status?: string | null
          mp_preference_id?: string | null
          nome: string
          numero: string
          order_number: string
          rua: string
          shipping_fee_cents?: number
          shipping_method: string
          status?: string
          subtotal_cents: number
          telefone: string
          total_cents: number
          uf: string
          updated_at?: string
        }
        Update: {
          access_token?: string
          bairro?: string
          cep?: string
          cidade?: string
          complemento?: string | null
          created_at?: string
          customer_id?: string | null
          email?: string
          id?: string
          mp_payment_id?: string | null
          mp_payment_status?: string | null
          mp_preference_id?: string | null
          nome?: string
          numero?: string
          order_number?: string
          rua?: string
          shipping_fee_cents?: number
          shipping_method?: string
          status?: string
          subtotal_cents?: number
          telefone?: string
          total_cents?: number
          uf?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "shop_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_products: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          price_cents: number
          price_tier2_cents: number
          price_tier3_cents: number
          slug: string
          updated_at: string
          weight_grams: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          price_cents: number
          price_tier2_cents: number
          price_tier3_cents: number
          slug: string
          updated_at?: string
          weight_grams: number
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          price_cents?: number
          price_tier2_cents?: number
          price_tier3_cents?: number
          slug?: string
          updated_at?: string
          weight_grams?: number
        }
        Relationships: []
      }
      shop_quiz_responses: {
        Row: {
          answers: Json
          created_at: string
          id: string
          primary_result_slug: string
          secondary_result_slug: string | null
        }
        Insert: {
          answers: Json
          created_at?: string
          id?: string
          primary_result_slug: string
          secondary_result_slug?: string | null
        }
        Update: {
          answers?: Json
          created_at?: string
          id?: string
          primary_result_slug?: string
          secondary_result_slug?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          current_period_ends_at: string | null
          platform: string | null
          product_id: string | null
          status: string
          trial_ends_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          current_period_ends_at?: string | null
          platform?: string | null
          product_id?: string | null
          status?: string
          trial_ends_at: string
          updated_at?: string
          user_id: string
        }
        Update: {
          current_period_ends_at?: string | null
          platform?: string | null
          product_id?: string | null
          status?: string
          trial_ends_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      todos: {
        Row: {
          cat_key: string
          cat_name: string
          completed_at: string | null
          created_at: string
          done: boolean
          due_date: string | null
          id: string
          origin: string | null
          prio: number | null
          repeat: boolean
          repeat_type: string | null
          text: string
          time: string | null
          user_id: string
        }
        Insert: {
          cat_key: string
          cat_name: string
          completed_at?: string | null
          created_at?: string
          done?: boolean
          due_date?: string | null
          id?: string
          origin?: string | null
          prio?: number | null
          repeat?: boolean
          repeat_type?: string | null
          text: string
          time?: string | null
          user_id: string
        }
        Update: {
          cat_key?: string
          cat_name?: string
          completed_at?: string | null
          created_at?: string
          done?: boolean
          due_date?: string | null
          id?: string
          origin?: string | null
          prio?: number | null
          repeat?: boolean
          repeat_type?: string | null
          text?: string
          time?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_journeys: {
        Row: {
          data_conclusao: string | null
          data_inicio: string
          dia_atual: number
          journey_id: string
          lesson_step: number
          status: string
          user_id: string
        }
        Insert: {
          data_conclusao?: string | null
          data_inicio?: string
          dia_atual?: number
          journey_id: string
          lesson_step?: number
          status: string
          user_id: string
        }
        Update: {
          data_conclusao?: string | null
          data_inicio?: string
          dia_atual?: number
          journey_id?: string
          lesson_step?: number
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      user_state: {
        Row: {
          focus_journey: string | null
          last_completed_day: number | null
          last_completed_journey: string | null
          onboarded: boolean
          streak_best: number
          streak_current: number
          streak_last_active_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          focus_journey?: string | null
          last_completed_day?: number | null
          last_completed_journey?: string | null
          onboarded?: boolean
          streak_best?: number
          streak_current?: number
          streak_last_active_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          focus_journey?: string | null
          last_completed_day?: number | null
          last_completed_journey?: string | null
          onboarded?: boolean
          streak_best?: number
          streak_current?: number
          streak_last_active_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_flora_usage: {
        Args: { p_date: string; p_quota?: number; p_user_id: string }
        Returns: {
          allowed: boolean
          messages_used: number
          quota: number
        }[]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
