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
      approval_steps: {
        Row: {
          approved_at: string | null
          approver_email: string | null
          approver_name: string | null
          approver_role: string | null
          approver_user_id: string | null
          comments: string | null
          created_at: string | null
          id: string
          status: string | null
          step_number: number
          workflow_instance_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approver_email?: string | null
          approver_name?: string | null
          approver_role?: string | null
          approver_user_id?: string | null
          comments?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          step_number: number
          workflow_instance_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approver_email?: string | null
          approver_name?: string | null
          approver_role?: string | null
          approver_user_id?: string | null
          comments?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          step_number?: number
          workflow_instance_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "approval_steps_approver_user_id_fkey"
            columns: ["approver_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_steps_workflow_instance_id_fkey"
            columns: ["workflow_instance_id"]
            isOneToOne: false
            referencedRelation: "workflow_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_workflows: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          updated_at: string | null
          workflow_type: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          updated_at?: string | null
          workflow_type: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          updated_at?: string | null
          workflow_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_workflows_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
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
      budget_approvals: {
        Row: {
          approved_at: string | null
          approver_id: string | null
          budget_id: string | null
          comments: string | null
          created_at: string | null
          id: string
          status: string | null
        }
        Insert: {
          approved_at?: string | null
          approver_id?: string | null
          budget_id?: string | null
          comments?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
        }
        Update: {
          approved_at?: string | null
          approver_id?: string | null
          budget_id?: string | null
          comments?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_approvals_approver_id_fkey"
            columns: ["approver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_approvals_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          amount: number
          approved_by: string | null
          assigned_to: string | null
          attachments: Json | null
          created_at: string | null
          created_by: string
          id: string
          notes: string | null
          purpose: string
          source: Database["public"]["Enums"]["budget_source"]
          status: Database["public"]["Enums"]["budget_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          approved_by?: string | null
          assigned_to?: string | null
          attachments?: Json | null
          created_at?: string | null
          created_by: string
          id?: string
          notes?: string | null
          purpose: string
          source: Database["public"]["Enums"]["budget_source"]
          status?: Database["public"]["Enums"]["budget_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          approved_by?: string | null
          assigned_to?: string | null
          attachments?: Json | null
          created_at?: string | null
          created_by?: string
          id?: string
          notes?: string | null
          purpose?: string
          source?: Database["public"]["Enums"]["budget_source"]
          status?: Database["public"]["Enums"]["budget_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budgets_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budgets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budgets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
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
      permission_audit_logs: {
        Row: {
          action_type: string | null
          changed_by: string | null
          created_at: string | null
          id: string
          new_value: boolean | null
          old_value: boolean | null
          permission: Database["public"]["Enums"]["permission_type"] | null
          target_role: string | null
          target_user_id: string | null
        }
        Insert: {
          action_type?: string | null
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_value?: boolean | null
          old_value?: boolean | null
          permission?: Database["public"]["Enums"]["permission_type"] | null
          target_role?: string | null
          target_user_id?: string | null
        }
        Update: {
          action_type?: string | null
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_value?: boolean | null
          old_value?: boolean | null
          permission?: Database["public"]["Enums"]["permission_type"] | null
          target_role?: string | null
          target_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "permission_audit_logs_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permission_audit_logs_target_user_id_fkey"
            columns: ["target_user_id"]
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
      role_permissions: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          id: string
          permission: Database["public"]["Enums"]["permission_type"]
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          permission: Database["public"]["Enums"]["permission_type"]
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          permission?: Database["public"]["Enums"]["permission_type"]
          role?: string
          updated_at?: string | null
        }
        Relationships: []
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
      user_permissions: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          id: string
          permission: Database["public"]["Enums"]["permission_type"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          permission: Database["public"]["Enums"]["permission_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          permission?: Database["public"]["Enums"]["permission_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
      workflow_instances: {
        Row: {
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          current_step: number | null
          document_id: string
          document_type: string
          id: string
          status: string | null
          workflow_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          current_step?: number | null
          document_id: string
          document_type: string
          id?: string
          status?: string | null
          workflow_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          current_step?: number | null
          document_id?: string
          document_type?: string
          id?: string
          status?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_instances_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_instances_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "approval_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_steps: {
        Row: {
          approver_role: string | null
          approver_type: string
          approver_user_id: string | null
          created_at: string | null
          id: string
          is_required: boolean | null
          step_order: number
          workflow_id: string | null
        }
        Insert: {
          approver_role?: string | null
          approver_type: string
          approver_user_id?: string | null
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          step_order: number
          workflow_id?: string | null
        }
        Update: {
          approver_role?: string | null
          approver_type?: string
          approver_user_id?: string | null
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          step_order?: number
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_steps_approver_user_id_fkey"
            columns: ["approver_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_steps_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "approval_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      budget_source:
        | "government_grant"
        | "internal_allocation"
        | "donor_funding"
        | "emergency_fund"
        | "project_specific"
        | "other"
      budget_status:
        | "draft"
        | "pending_approval"
        | "approved"
        | "active"
        | "completed"
        | "cancelled"
      permission_type:
        | "dashboard"
        | "rfqs"
        | "bids"
        | "suppliers"
        | "inventory"
        | "warehouses"
        | "messaging"
        | "audit"
        | "users"
        | "settings"
        | "budgets"
        | "reports"
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
    Enums: {
      budget_source: [
        "government_grant",
        "internal_allocation",
        "donor_funding",
        "emergency_fund",
        "project_specific",
        "other",
      ],
      budget_status: [
        "draft",
        "pending_approval",
        "approved",
        "active",
        "completed",
        "cancelled",
      ],
      permission_type: [
        "dashboard",
        "rfqs",
        "bids",
        "suppliers",
        "inventory",
        "warehouses",
        "messaging",
        "audit",
        "users",
        "settings",
        "budgets",
        "reports",
      ],
    },
  },
} as const
