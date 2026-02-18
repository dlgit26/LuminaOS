/*
  # Seed Diamond's Natal Chart Data

  1. Changes
    - Creates a function to update a user's natal chart data
    - Sets Diamond's natal chart data including:
      - Sun: Virgo (10.13°)
      - Moon: Libra (6.82°)
      - Rising: Scorpio (9.65°)
      - Full planetary positions with houses and aspects

  2. Notes
    - Function can be called on any user profile
    - Will be automatically applied to first user who signs up
*/

-- Function to seed Diamond's natal chart data
CREATE OR REPLACE FUNCTION seed_diamond_natal_data(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET
    sun_sign = 'Virgo',
    moon_sign = 'Libra',
    rising_sign = 'Scorpio',
    natal_positions = '{
      "sun": { "sign": "Virgo", "degree": 10.13, "longitude": 160.13, "house": 10 },
      "moon": { "sign": "Libra", "degree": 6.82, "longitude": 186.82, "house": 11 },
      "mercury": { "sign": "Libra", "degree": 6.83, "longitude": 186.83, "house": 11 },
      "venus": { "sign": "Libra", "degree": 18.43, "longitude": 198.43, "house": 11 },
      "mars": { "sign": "Virgo", "degree": 19.10, "longitude": 169.10, "house": 10 },
      "jupiter": { "sign": "Cancer", "degree": 6.12, "longitude": 96.12, "house": 8 },
      "saturn": { "sign": "Capricorn", "degree": 7.37, "longitude": 277.37, "house": 2, "retrograde": true },
      "pluto": { "sign": "Scorpio", "degree": 12.87, "longitude": 222.87, "house": 1 },
      "northNode": { "sign": "Aquarius", "degree": 25.68, "longitude": 325.68, "house": 4 },
      "ascendant": { "sign": "Scorpio", "degree": 9.65, "longitude": 219.65 },
      "midheaven": { "sign": "Leo", "degree": 17.92, "longitude": 137.92 }
    }'::jsonb
  WHERE id = target_user_id;
END;
$$;

-- Trigger function to automatically seed natal data for the first user
CREATE OR REPLACE FUNCTION auto_seed_first_user_natal_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_count integer;
BEGIN
  -- Check if this is the first user
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  -- If this is the first user, seed Diamond's natal data
  IF user_count = 1 THEN
    PERFORM seed_diamond_natal_data(NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-seed first user's natal data
DROP TRIGGER IF EXISTS on_first_profile_created ON profiles;
CREATE TRIGGER on_first_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_seed_first_user_natal_data();