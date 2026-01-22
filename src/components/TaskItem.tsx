import { useState } from 'react';
import { Flame } from 'lucide-react';
import clsx from 'clsx';
import { getAreaConfig } from './AreaPicker';

interface TaskItemProps {
  id: string;
  title: string;
  task_type: 'foundation' | 'routine' | 'standard' | 'deep_work';
  completed: boolean;
  streak_required: boolean;
  area: string | null;
  onToggle: (id: string, completed: boolean) => void;
}

const taskTypeLabels: Record<string, string> = {
  foundation: 'Foundation',
  routine: 'Routine',
  standard: 'Task',
  deep_work: 'Deep Work',
};

const taskTypeColors: Record<string, string> = {
  foundation: 'bg-purple-100 text-purple-700',
  routine: 'bg-blue-100 text-blue-700',
  standard: 'bg-gray-100 text-gray-700',
  deep_work: 'bg-indigo-100 text-indigo-700',
};

export function TaskItem({
  id,
  title,
  task_type,
  completed,
  streak_required,
  area,
  onToggle,
}: TaskItemProps) {
  const [celebrating, setCelebrating] = useState(false);
  const areaConfig = getAreaConfig(area);
  const AreaIcon = areaConfig?.icon;

  const handleToggle = (checked: boolean) => {
    if (checked && !completed) {
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 400);
    }
    onToggle(id, checked);
  };

  return (
    <div
      className={clsx(
        "flex items-center gap-3 py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors",
        celebrating && "animate-celebrate"
      )}
    >
      <input
        type="checkbox"
        checked={completed}
        onChange={(e) => handleToggle(e.target.checked)}
        className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
      />

      <div className="flex-1 min-w-0">
        <span
          className={clsx(
            'text-base text-gray-900',
            completed && 'line-through text-gray-400'
          )}
        >
          {title}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {streak_required && (
          <Flame className="w-4 h-4 text-orange-500" fill="currentColor" />
        )}

        {areaConfig && AreaIcon && (
          <span
            className={clsx(
              'inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
              areaConfig.color
            )}
          >
            <AreaIcon className="w-3 h-3" />
            <span>{areaConfig.label}</span>
          </span>
        )}

        <span
          className={clsx(
            'text-xs font-medium px-2 py-1 rounded-full',
            taskTypeColors[task_type]
          )}
        >
          {taskTypeLabels[task_type]}
        </span>
      </div>
    </div>
  );
}
