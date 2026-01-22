import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  count: number;
}

export function StreakBadge({ count }: StreakBadgeProps) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full">
      <Flame className="w-4 h-4 text-orange-500" fill="currentColor" />
      <span className="text-sm font-semibold text-orange-700">{count}</span>
    </div>
  );
}
