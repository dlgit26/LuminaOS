import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { processEndOfDay } from '../lib/streak-maintenance';

export function useStreak(userId: string) {
  const [streak, setStreak] = useState(0);
  const [freezes, setFreezes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const initStreak = async () => {
      await processEndOfDay(userId);
      await fetchStreak();
    };

    const fetchStreak = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('streak_count, streak_freezes')
        .eq('id', userId)
        .maybeSingle();

      if (data) {
        setStreak(data.streak_count || 0);
        setFreezes(data.streak_freezes || 0);
      }
      setLoading(false);
    };

    initStreak();
  }, [userId]);

  return { streak, freezes, loading };
}
