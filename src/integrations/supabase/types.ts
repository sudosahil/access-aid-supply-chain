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
      bids: {
        Row: {
          amount: number
          contractor_id: string
          created_at: string
          documents: number | null
          id: string
          rfq_id: string
          status: string
          submitted_date: string
          supplier_name: string
          updated_at: string
        }
        Insert: {
          amount: number
          contractor_id: string
          created_at?: string
          documents?: number | null
          id: string
          rfq_id: string
          status?: string
          submitted_date?: string
          supplier_name: string
          updated_at?: string
        }
        Update: {
          amount?: number
          contractor_id?: string
          created_at?: string
          documents?: number | null
          id?: string
          rfq_id?: string
          status?: string
          submitted_date?: string
          supplier_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bids_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bids_rfq_id_fkey"
            columns: ["rfq_id"]
            isOneToOne: false
            referencedRelation: "rfqs"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          category: string
          created_at: string
          description: string | null
          dimensions: string | null
          id: string
          last_update: string
          manufacturer: string | null
          model: string | null
          name: string
          purchase_date: string | null
          quantity: number
          reorder_level: number
          serial_number: string
          unit_price: string
          updated_at: string
          updated_by: string
          warehouse: string
          warranty_expiry: string | null
          weight: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          dimensions?: string | null
          id: string
          last_update?: string
          manufacturer?: string | null
          model?: string | null
          name: string
          purchase_date?: string | null
          quantity?: number
          reorder_level?: number
          serial_number: string
          unit_price: string
          updated_at?: string
          updated_by: string
          warehouse: string
          warranty_expiry?: string | null
          weight?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          dimensions?: string | null
          id?: string
          last_update?: string
          manufacturer?: string | null
          model?: string | null
          name?: string
          purchase_date?: string | null
          quantity?: number
          reorder_level?: number
          serial_number?: string
          unit_price?: string
          updated_at?: string
          updated_by?: string
          warehouse?: string
          warranty_expiry?: string | null
          weight?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          message_type: string
          recipient_id: string | null
          rfq_id: string | null
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          message_type?: string
          recipient_id?: string | null
          rfq_id?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message_type?: string
          recipient_id?: string | null
          rfq_id?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_rfq_id_fkey"
            columns: ["rfq_id"]
            isOneToOne: false
            referencedRelation: "rfqs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rfqs: {
        Row: {
          budget: number
          category: string
          created_at: string
          created_by: string
          deadline: string
          description: string
          id: string
          requirements: string[] | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          budget: number
          category: string
          created_at?: string
          created_by: string
          deadline: string
          description: string
          id: string
          requirements?: string[] | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          budget?: number
          category?: string
          created_at?: string
          created_by?: string
          deadline?: string
          description?: string
          id?: string
          requirements?: string[] | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rfqs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transfer_requests: {
        Row: {
          created_at: string
          from_warehouse: string
          id: string
          item_id: string | null
          item_name: string
          priority: string
          quantity: number
          request_date: string
          requested_by: string
          status: string
          to_warehouse: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          from_warehouse: string
          id: string
          item_id?: string | null
          item_name: string
          priority?: string
          quantity: number
          request_date?: string
          requested_by: string
          status?: string
          to_warehouse: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          from_warehouse?: string
          id?: string
          item_id?: string | null
          item_name?: string
          priority?: string
          quantity?: number
          request_date?: string
          requested_by?: string
          status?: string
          to_warehouse?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transfer_requests_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          password: string
          profile_photo: string | null
          role: string
          updated_at: string
          warehouse_id: string | null
          warehouse_name: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          password: string
          profile_photo?: string | null
          role: string
          updated_at?: string
          warehouse_id?: string | null
          warehouse_name?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          password?: string
          profile_photo?: string | null
          role?: string
          updated_at?: string
          warehouse_id?: string | null
          warehouse_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
