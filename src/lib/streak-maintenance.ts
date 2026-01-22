import { supabase } from './supabase';
import { getLogicalDate, getLogicalDateString } from './date-utils';

export async function processEndOfDay(userId: string) {
  const today = getLogicalDateString();
  const yesterdayDate = new Date(getLogicalDate().getTime() - 24 * 60 * 60 * 1000);
  const yesterday = getLogicalDateString(yesterdayDate);

  const { data: yesterdayLog } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('log_date', yesterday)
    .maybeSingle();

  if (!yesterdayLog) {
    await handleMissedDay(userId);
    return;
  }

  if (yesterdayLog.streak_met !== null) return;

  const streakMet = await checkStreakCondition(userId, yesterday, yesterdayLog.is_gentle_mode);

  await supabase
    .from('daily_logs')
    .update({ streak_met: streakMet })
    .eq('id', yesterdayLog.id);

  if (!streakMet) {
    await handleMissedDay(userId);
  } else {
    await incrementStreak(userId);
  }
}

async function checkStreakCondition(
  userId: string,
  date: string,
  isGentleMode: boolean
): Promise<boolean> {
  const { data: foundationTasks } = await supabase
    .from('tasks')
    .select('id, completed')
    .eq('user_id', userId)
    .eq('due_date', date)
    .eq('task_type', 'foundation')
    .eq('owner', 'diamond');

  const foundationComplete = foundationTasks?.every((t) => t.completed) ?? true;

  if (isGentleMode) {
    return foundationComplete;
  }

  const { data: streakTasks } = await supabase
    .from('tasks')
    .select('id, completed')
    .eq('user_id', userId)
    .eq('due_date', date)
    .eq('streak_required', true);

  const streakTasksComplete = streakTasks?.every((t) => t.completed) ?? true;

  return foundationComplete && streakTasksComplete;
}

async function handleMissedDay(userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('streak_count, streak_freezes')
    .eq('id', userId)
    .maybeSingle();

  if (!profile) return;

  if (profile.streak_freezes > 0) {
    await supabase
      .from('profiles')
      .update({ streak_freezes: profile.streak_freezes - 1 })
      .eq('id', userId);
  } else {
    await supabase
      .from('profiles')
      .update({ streak_count: 0 })
      .eq('id', userId);
  }
}

async function incrementStreak(userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('streak_count, streak_freezes, longest_streak')
    .eq('id', userId)
    .maybeSingle();

  if (!profile) return;

  const newStreak = (profile.streak_count || 0) + 1;
  const newLongest = Math.max(newStreak, profile.longest_streak || 0);

  let newFreezes = profile.streak_freezes || 0;
  if (newStreak % 7 === 0 && newFreezes < 3) {
    newFreezes += 1;
  }

  await supabase
    .from('profiles')
    .update({
      streak_count: newStreak,
      longest_streak: newLongest,
      streak_freezes: newFreezes,
    })
    .eq('id', userId);
}
