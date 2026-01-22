/*
  # Add Area Field to Tasks

  1. Changes
    - Add `area` column to `tasks` table with predefined life areas
    - Area is optional to allow existing tasks to remain valid
    - Valid areas: Health, Work, Relationships, Creativity, Learning, Home, Finance, Spirituality

  2. Notes
    - Existing tasks will have NULL area (shown as "General" in UI)
    - New tasks can optionally specify an area for better organization
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'area'
  ) THEN
    ALTER TABLE tasks ADD COLUMN area text;

    ALTER TABLE tasks ADD CONSTRAINT tasks_area_check
      CHECK (area IS NULL OR area IN (
        'Health',
        'Work',
        'Relationships',
        'Creativity',
        'Learning',
        'Home',
        'Finance',
        'Spirituality'
      ));
  END IF;
END $$;
