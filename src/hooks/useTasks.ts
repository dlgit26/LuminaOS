import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { getLogicalDateString } from '../lib/date-utils';

type Task = Database['public']['Tables']['tasks']['Row'];

export function useTasks(userId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const logicalDate = getLogicalDateString();

      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('due_date', logicalDate)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      setTasks((data as Task[]) || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [userId]);

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          completed,
          completed_at: completed ? new Date().toISOString() : null,
        })
        .eq('id', taskId);

      if (updateError) throw updateError;

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                completed,
                completed_at: completed ? new Date().toISOString() : null,
              }
            : task
        )
      );
    } catch (err) {
      setError(err as Error);
    }
  };

  return {
    tasks,
    loading,
    error,
    toggleTask,
    refetch: fetchTasks,
  };
}
