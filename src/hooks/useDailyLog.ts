import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { getLogicalDateString } from '../lib/date-utils';

type DailyLog = Database['public']['Tables']['daily_logs']['Row'];

export function useDailyLog(userId: string) {
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDailyLog = async () => {
    try {
      setLoading(true);
      const logicalDate = getLogicalDateString();

      const { data, error: fetchError } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('log_date', logicalDate)
        .maybeSingle();

      if (fetchError) throw fetchError;
      setDailyLog(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyLog();
  }, [userId]);

  const updateGentleMode = async (isGentleMode: boolean) => {
    try {
      const logicalDate = getLogicalDateString();

      const { data, error: upsertError } = await supabase
        .from('daily_logs')
        .upsert(
          {
            user_id: userId,
            log_date: logicalDate,
            is_gentle_mode: isGentleMode,
          },
          { onConflict: 'user_id,log_date' }
        )
        .select()
        .single();

      if (upsertError) throw upsertError;
      setDailyLog(data);
    } catch (err) {
      setError(err as Error);
    }
  };

  return {
    dailyLog,
    loading,
    error,
    updateGentleMode,
    refetch: fetchDailyLog,
  };
}
