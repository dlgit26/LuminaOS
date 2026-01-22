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
      profiles: {
        Row: {
          id: string
          email: string
          sun_sign: string | null
          moon_sign: string | null
          rising_sign: string | null
          natal_positions: Json | null
          theme: string
          timezone: string | null
          evening_checkin_time: string
          streak_count: number
          longest_streak: number
          streak_freezes: number
          created_at: string
        }
        Insert: {
          id: string
          email: string
          sun_sign?: string | null
          moon_sign?: string | null
          rising_sign?: string | null
          natal_positions?: Json | null
          theme?: string
          timezone?: string | null
          evening_checkin_time?: string
          streak_count?: number
          longest_streak?: number
          streak_freezes?: number
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          sun_sign?: string | null
          moon_sign?: string | null
          rising_sign?: string | null
          natal_positions?: Json | null
          theme?: string
          timezone?: string | null
          evening_checkin_time?: string
          streak_count?: number
          longest_streak?: number
          streak_freezes?: number
          created_at?: string
        }
      }
      areas: {
        Row: {
          id: string
          user_id: string
          name: string
          emoji: string | null
          color: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          emoji?: string | null
          color?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          emoji?: string | null
          color?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          area_id: string | null
          project_id: string | null
          parent_task_id: string | null
          title: string
          notes: string | null
          task_type: string
          is_grouped_task: boolean
          owner: string
          cognitive_cost: number
          streak_required: boolean
          due_date: string | null
          recurring_pattern: Json | null
          completed: boolean
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          area_id?: string | null
          project_id?: string | null
          parent_task_id?: string | null
          title: string
          notes?: string | null
          task_type?: string
          is_grouped_task?: boolean
          owner?: string
          cognitive_cost?: number
          streak_required?: boolean
          due_date?: string | null
          recurring_pattern?: Json | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          area_id?: string | null
          project_id?: string | null
          parent_task_id?: string | null
          title?: string
          notes?: string | null
          task_type?: string
          is_grouped_task?: boolean
          owner?: string
          cognitive_cost?: number
          streak_required?: boolean
          due_date?: string | null
          recurring_pattern?: Json | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
      }
      daily_logs: {
        Row: {
          id: string
          user_id: string
          log_date: string
          morning_energy: number | null
          morning_gratitudes: string[] | null
          morning_timestamp: string | null
          evening_mood: number | null
          evening_timestamp: string | null
          reflection_wins: string | null
          reflection_challenges: string | null
          reflection_tomorrow: string | null
          journal_entry: string | null
          tasks_completed: number
          streak_tasks_completed: number
          total_points: number
          streak_met: boolean
          freeze_used: boolean
          is_gentle_mode: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          log_date: string
          morning_energy?: number | null
          morning_gratitudes?: string[] | null
          morning_timestamp?: string | null
          evening_mood?: number | null
          evening_timestamp?: string | null
          reflection_wins?: string | null
          reflection_challenges?: string | null
          reflection_tomorrow?: string | null
          journal_entry?: string | null
          tasks_completed?: number
          streak_tasks_completed?: number
          total_points?: number
          streak_met?: boolean
          freeze_used?: boolean
          is_gentle_mode?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          log_date?: string
          morning_energy?: number | null
          morning_gratitudes?: string[] | null
          morning_timestamp?: string | null
          evening_mood?: number | null
          evening_timestamp?: string | null
          reflection_wins?: string | null
          reflection_challenges?: string | null
          reflection_tomorrow?: string | null
          journal_entry?: string | null
          tasks_completed?: number
          streak_tasks_completed?: number
          total_points?: number
          streak_met?: boolean
          freeze_used?: boolean
          is_gentle_mode?: boolean
          created_at?: string
        }
      }
    }
  }
}
