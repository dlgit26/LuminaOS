import clsx from 'clsx';
import { TaskItem } from './TaskItem';
import { Database } from '../lib/database.types';

type Task = Database['public']['Tables']['tasks']['Row'] & {
  area: {
    name: string;
    emoji: string | null;
    color: string | null;
  } | null;
};

interface TaskSectionProps {
  tasks: Task[];
  isGentleMode: boolean;
  onToggle: (id: string, completed: boolean) => void;
}

export function TaskSection({ tasks, isGentleMode, onToggle }: TaskSectionProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-opacity',
        isGentleMode && 'opacity-60'
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
          Today's Tasks
        </h2>
        {isGentleMode && (
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
            Optional Today
          </span>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-2">No tasks for today</p>
          <p className="text-sm text-gray-400">Tap + to add a task</p>
        </div>
      ) : (
        <div className="space-y-1">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              id={task.id}
              title={task.title}
              task_type={task.task_type as any}
              completed={task.completed}
              streak_required={task.streak_required}
              area={task.area}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
