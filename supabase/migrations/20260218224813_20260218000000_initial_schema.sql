/*
  # Initial Schema Setup
  
  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique, not null)
      - `sun_sign` (text, nullable)
      - `moon_sign` (text, nullable)
      - `rising_sign` (text, nullable)
      - `natal_positions` (jsonb, nullable)
      - `theme` (text, default 'cosmic')
      - `timezone` (text, nullable)
      - `evening_checkin_time` (text, default '20:00')
      - `streak_count` (integer, default 0)
      - `longest_streak` (integer, default 0)
      - `streak_freezes` (integer, default 3)
      - `created_at` (timestamp with timezone, default now())
    
    - `areas`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, references auth.users)
      - `name` (text, not null)
      - `emoji` (text, nullable)
      - `color` (text, nullable)
      - `sort_order` (integer, default 0)
      - `created_at` (timestamp with timezone, default now())
    
    - `tasks`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, references auth.users)
      - `area_id` (uuid, references areas, nullable)
      - `project_id` (uuid, nullable)
      - `parent_task_id` (uuid, self-reference, nullable)
      - `title` (text, not null)
      - `notes` (text, nullable)
      - `task_type` (text, default 'self')
      - `is_grouped_task` (boolean, default false)
      - `owner` (text, default 'self')
      - `cognitive_cost` (integer, default 2)
      - `streak_required` (boolean, default false)
      - `due_date` (timestamp with timezone, nullable)
      - `recurring_pattern` (jsonb, nullable)
      - `completed` (boolean, default false)
      - `completed_at` (timestamp with timezone, nullable)
      - `created_at` (timestamp with timezone, default now())
    
    - `daily_logs`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, references auth.users)
      - `log_date` (date, not null)
      - `morning_energy` (integer, nullable)
      - `morning_gratitudes` (text array, nullable)
      - `morning_timestamp` (timestamp with timezone, nullable)
      - `evening_mood` (integer, nullable)
      - `evening_timestamp` (timestamp with timezone, nullable)
      - `reflection_wins` (text, nullable)
      - `reflection_challenges` (text, nullable)
      - `reflection_tomorrow` (text, nullable)
      - `journal_entry` (text, nullable)
      - `tasks_completed` (integer, default 0)
      - `streak_tasks_completed` (integer, default 0)
      - `total_points` (integer, default 0)
      - `streak_met` (boolean, default false)
      - `freeze_used` (boolean, default false)
      - `is_gentle_mode` (boolean, default false)
      - `created_at` (timestamp with timezone, default now())
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Add policy for users to read their own profile
    - Add policies for users to manage their own tasks, areas, and daily logs
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  sun_sign text,
  moon_sign text,
  rising_sign text,
  natal_positions jsonb,
  theme text DEFAULT 'cosmic',
  timezone text,
  evening_checkin_time text DEFAULT '20:00',
  streak_count integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  streak_freezes integer DEFAULT 3,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create areas table
CREATE TABLE IF NOT EXISTS areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  emoji text,
  color text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own areas"
  ON areas FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own areas"
  ON areas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own areas"
  ON areas FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own areas"
  ON areas FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  area_id uuid REFERENCES areas ON DELETE SET NULL,
  project_id uuid,
  parent_task_id uuid REFERENCES tasks ON DELETE CASCADE,
  title text NOT NULL,
  notes text,
  task_type text DEFAULT 'self',
  is_grouped_task boolean DEFAULT false,
  owner text DEFAULT 'self',
  cognitive_cost integer DEFAULT 2,
  streak_required boolean DEFAULT false,
  due_date timestamptz,
  recurring_pattern jsonb,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create daily_logs table
CREATE TABLE IF NOT EXISTS daily_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  log_date date NOT NULL,
  morning_energy integer,
  morning_gratitudes text[],
  morning_timestamp timestamptz,
  evening_mood integer,
  evening_timestamp timestamptz,
  reflection_wins text,
  reflection_challenges text,
  reflection_tomorrow text,
  journal_entry text,
  tasks_completed integer DEFAULT 0,
  streak_tasks_completed integer DEFAULT 0,
  total_points integer DEFAULT 0,
  streak_met boolean DEFAULT false,
  freeze_used boolean DEFAULT false,
  is_gentle_mode boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, log_date)
);

ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own daily logs"
  ON daily_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily logs"
  ON daily_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily logs"
  ON daily_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily logs"
  ON daily_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();