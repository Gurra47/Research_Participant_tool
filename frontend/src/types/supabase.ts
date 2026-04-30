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
          researcher_name: string | null
          researcher_email: string | null
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
          researcher_name?: string | null
          researcher_email?: string | null
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
          researcher_name?: string | null
          researcher_email?: string | null
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
          timeslot_id: string | null
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
          timeslot_id?: string | null
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
          timeslot_id?: string | null
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
      timeslots: {
        Row: {
          id: string
          study_id: string
          starts_at: string
          capacity: number
          location: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          study_id: string
          starts_at: string
          capacity?: number
          location?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          study_id?: string
          starts_at?: string
          capacity?: number
          location?: string | null
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeslots_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "studies"
            referencedColumns: ["id"]
          }
        ]
      }
      student_profiles: {
        Row: {
          email: string
          display_name: string | null
          university: string | null
          programme: string | null
          study_year: string | null
          bio: string | null
          research_interests: string | null
          availability_note: string | null
          updated_at: string
          created_at: string
        }
        Insert: {
          email: string
          display_name?: string | null
          university?: string | null
          programme?: string | null
          study_year?: string | null
          bio?: string | null
          research_interests?: string | null
          availability_note?: string | null
          updated_at?: string
          created_at?: string
        }
        Update: {
          email?: string
          display_name?: string | null
          university?: string | null
          programme?: string | null
          study_year?: string | null
          bio?: string | null
          research_interests?: string | null
          availability_note?: string | null
          updated_at?: string
          created_at?: string
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
