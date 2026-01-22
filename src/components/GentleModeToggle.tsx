import { Heart } from 'lucide-react';
import clsx from 'clsx';

interface GentleModeToggleProps {
  isActive: boolean;
  onToggle: (value: boolean) => void;
}

export function GentleModeToggle({ isActive, onToggle }: GentleModeToggleProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Gentle Mode</span>
        <button
          onClick={() => onToggle(!isActive)}
          className={clsx(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
            isActive ? 'bg-purple-600' : 'bg-gray-300'
          )}
        >
          <span
            className={clsx(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              isActive ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </button>
      </div>

      {isActive && (
        <div className="bg-gradient-to-r from-purple-100 to-pink-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" />
            <div>
              <p className="font-semibold text-purple-900">Gentle Mode Active</p>
              <p className="text-sm text-purple-700 mt-0.5">
                Rest is productive. Do what you can.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
