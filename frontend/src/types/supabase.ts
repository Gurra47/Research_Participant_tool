export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      studies: {
        Row: {
          id: string
          title: string
          description: string | null
          status: string | null
          location: string | null
          duration_minutes: number | null
          credits: number | null
          capacity: number | null
          requirements: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: string | null
          location?: string | null
          duration_minutes?: number | null
          credits?: number | null
          capacity?: number | null
          requirements?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: string | null
          location?: string | null
          duration_minutes?: number | null
          credits?: number | null
          capacity?: number | null
          requirements?: string | null
          created_at?: string
        }
        Relationships: []
      }
      participants: {
        Row: {
          id: string
          study_id: string
          name: string
          email: string
          status: string | null
          booking_time: string | null
          credits_awarded: number | null
          created_at: string
        }
        Insert: {
          id?: string
          study_id: string
          name: string
          email: string
          status?: string | null
          booking_time?: string | null
          credits_awarded?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          study_id?: string
          name?: string
          email?: string
          status?: string | null
          booking_time?: string | null
          credits_awarded?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "participants_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "studies"
            referencedColumns: ["id"]
          }
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
