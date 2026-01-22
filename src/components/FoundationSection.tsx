import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { TaskItem } from './TaskItem';
import { Database } from '../lib/database.types';

type Task = Database['public']['Tables']['tasks']['Row'] & {
  area: {
    name: string;
    emoji: string | null;
    color: string | null;
  } | null;
};

interface FoundationSectionProps {
  tasks: Task[];
  isGentleMode: boolean;
  onToggle: (id: string, completed: boolean) => void;
}

export function FoundationSection({
  tasks,
  isGentleMode,
  onToggle,
}: FoundationSectionProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(['Morning Anchors'])
  );

  const groupedTasks = tasks.reduce((acc, task) => {
    const groupName = task.is_grouped_task ? 'Morning Anchors' : 'Other';
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }
      return next;
    });
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
            Your Foundation
          </h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-2">No foundation tasks yet</p>
          <p className="text-sm text-gray-400">
            Add your daily anchors like meds, hygiene, meals
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
          Your Foundation
        </h2>
        {isGentleMode && (
          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
            Required
          </span>
        )}
      </div>

      <div className="space-y-2">
        {Object.entries(groupedTasks).map(([groupName, groupTasks]) => (
          <div key={groupName}>
            <button
              onClick={() => toggleGroup(groupName)}
              className="flex items-center gap-2 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {expandedGroups.has(groupName) ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
              <span className="text-sm font-semibold text-gray-700">
                {groupName}
              </span>
              <span className="text-xs text-gray-500">
                ({groupTasks.filter((t) => t.completed).length}/{groupTasks.length})
              </span>
            </button>

            {expandedGroups.has(groupName) && (
              <div className="ml-6 space-y-1">
                {groupTasks.map((task) => (
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
        ))}
      </div>
    </div>
  );
}
