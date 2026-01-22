import { Database } from './database.types';
import { getLogicalDateString } from './date-utils';

type Task = Database['public']['Tables']['tasks']['Row'];

export function selectTaskForJustStart(tasks: Task[]): Task | null {
  const today = getLogicalDateString();
  const incompleteTasks = tasks.filter(t => !t.completed);

  if (incompleteTasks.length === 0) return null;

  const overdueStreakTasks = incompleteTasks.filter(
    t => t.streak_required && t.due_date < today
  );
  if (overdueStreakTasks.length > 0) {
    return overdueStreakTasks[0];
  }

  const todayStreakTasks = incompleteTasks.filter(
    t => t.streak_required && t.due_date === today
  );
  if (todayStreakTasks.length > 0) {
    return todayStreakTasks[0];
  }

  const foundationTasks = incompleteTasks.filter(
    t => t.task_type === 'foundation'
  );
  if (foundationTasks.length > 0) {
    return foundationTasks[0];
  }

  const sortedByCognitive = [...incompleteTasks].sort(
    (a, b) => (b.cognitive_cost || 0) - (a.cognitive_cost || 0)
  );

  return sortedByCognitive[0];
}
