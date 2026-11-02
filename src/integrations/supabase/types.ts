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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      analyses: {
        Row: {
          analysis_type: string
          architecture_score: number | null
          created_at: string
          id: string
          is_public: boolean
          performance_score: number | null
          quality_score: number | null
          repo_id: string
          report_json: Json
          security_score: number | null
          user_id: string
        }
        Insert: {
          analysis_type?: string
          architecture_score?: number | null
          created_at?: string
          id?: string
          is_public?: boolean
          performance_score?: number | null
          quality_score?: number | null
          repo_id: string
          report_json?: Json
          security_score?: number | null
          user_id: string
        }
        Update: {
          analysis_type?: string
          architecture_score?: number | null
          created_at?: string
          id?: string
          is_public?: boolean
          performance_score?: number | null
          quality_score?: number | null
          repo_id?: string
          report_json?: Json
          security_score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analyses_repo_id_fkey"
            columns: ["repo_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_jobs: {
        Row: {
          analysis_type: string
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          model_used: string | null
          pr_url: string | null
          repo_id: string | null
          report_json: Json
          started_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_type?: string
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          model_used?: string | null
          pr_url?: string | null
          repo_id?: string | null
          report_json?: Json
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_type?: string
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          model_used?: string | null
          pr_url?: string | null
          repo_id?: string | null
          report_json?: Json
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_jobs_repo_id_fkey"
            columns: ["repo_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      autonomous_fixes: {
        Row: {
          completed_at: string | null
          confidence_score: number
          created_at: string
          fixes_applied: number
          id: string
          issues_found: number
          pr_number: number
          pr_title: string | null
          repo_id: string | null
          repo_name: string | null
          report_json: Json
          status: string
          summary: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          confidence_score?: number
          created_at?: string
          fixes_applied?: number
          id?: string
          issues_found?: number
          pr_number: number
          pr_title?: string | null
          repo_id?: string | null
          repo_name?: string | null
          report_json?: Json
          status?: string
          summary?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          confidence_score?: number
          created_at?: string
          fixes_applied?: number
          id?: string
          issues_found?: number
          pr_number?: number
          pr_title?: string | null
          repo_id?: string | null
          repo_name?: string | null
          report_json?: Json
          status?: string
          summary?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "autonomous_fixes_repo_id_fkey"
            columns: ["repo_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      error_events: {
        Row: {
          context: Json
          created_at: string
          error_message: string
          function_name: string
          id: string
          stack_trace: string | null
          user_id: string | null
        }
        Insert: {
          context?: Json
          created_at?: string
          error_message: string
          function_name: string
          id?: string
          stack_trace?: string | null
          user_id?: string | null
        }
        Update: {
          context?: Json
          created_at?: string
          error_message?: string
          function_name?: string
          id?: string
          stack_trace?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      github_credentials: {
        Row: {
          created_at: string
          encrypted_token: string
          github_username: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          encrypted_token: string
          github_username?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          encrypted_token?: string
          github_username?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pr_analyses: {
        Row: {
          created_at: string
          id: string
          pr_number: number | null
          pr_title: string | null
          pr_url: string
          repo_name: string | null
          report_json: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          pr_number?: number | null
          pr_title?: string | null
          pr_url: string
          repo_name?: string | null
          report_json?: Json
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          pr_number?: number | null
          pr_title?: string | null
          pr_url?: string
          repo_name?: string | null
          report_json?: Json
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          github_access_token: string | null
          github_username: string | null
          id: string
          is_admin: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          github_access_token?: string | null
          github_username?: string | null
          id?: string
          is_admin?: boolean
          name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          github_access_token?: string | null
          github_username?: string | null
          id?: string
          is_admin?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      repositories: {
        Row: {
          created_at: string
          description: string | null
          forks: number | null
          github_repo_id: number | null
          id: string
          language: string | null
          last_updated: string | null
          repo_name: string
          repo_url: string
          stars: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          forks?: number | null
          github_repo_id?: number | null
          id?: string
          language?: string | null
          last_updated?: string | null
          repo_name: string
          repo_url: string
          stars?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          forks?: number | null
          github_repo_id?: number | null
          id?: string
          language?: string | null
          last_updated?: string | null
          repo_name?: string
          repo_url?: string
          stars?: number | null
          updated_at?: string
          user_id?: string
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
          role?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
