import { useState, useEffect, useRef, FormEvent } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getLogicalDateString } from '../lib/date-utils';
import { AreaPicker } from './AreaPicker';
import { TaskTypeSelector } from './TaskTypeSelector';
import { useAuth } from '../contexts/AuthContext';

interface QuickCaptureModalProps {
  onClose: () => void;
  onTaskCreated: () => void;
}

const cognitiveCosts = {
  foundation: 0.5,
  routine: 0.5,
  standard: 1.0,
  deep_work: 2.0,
};

export function QuickCaptureModal({ onClose, onTaskCreated }: QuickCaptureModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [taskType, setTaskType] = useState<'foundation' | 'routine' | 'standard' | 'deep_work'>('standard');
  const [streakRequired, setStreakRequired] = useState(false);
  const [dueDate, setDueDate] = useState(getLogicalDateString());
  const [owner, setOwner] = useState<'diamond' | 'husband' | 'shared'>('diamond');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !user) return;

    setSubmitting(true);

    const { error } = await supabase.from('tasks').insert({
      user_id: user.id,
      title: title.trim(),
      area: selectedArea,
      task_type: taskType,
      cognitive_cost: cognitiveCosts[taskType],
      streak_required: taskType === 'foundation' ? false : streakRequired,
      due_date: dueDate,
      owner: owner,
      is_grouped_task: taskType === 'foundation',
      completed: false,
    });

    setSubmitting(false);

    if (!error) {
      setTitle('');
      setSelectedArea(null);
      setTaskType('standard');
      setStreakRequired(false);
      setDueDate(getLogicalDateString());
      setOwner('diamond');

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2000);

      onTaskCreated();
      titleInputRef.current?.focus();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!user) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Quick Capture</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              ref={titleInputRef}
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <AreaPicker
              selectedArea={selectedArea}
              onSelectArea={setSelectedArea}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Type
            </label>
            <TaskTypeSelector selectedType={taskType} onSelect={setTaskType} />
          </div>

          {taskType !== 'foundation' && (
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="streakRequired"
                checked={streakRequired}
                onChange={(e) => setStreakRequired(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="streakRequired" className="text-sm font-medium text-gray-700">
                Required for streak
              </label>
            </div>
          )}

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner
            </label>
            <div className="flex gap-2">
              {(['diamond', 'husband', 'shared'] as const).map((ownerOption) => (
                <button
                  key={ownerOption}
                  type="button"
                  onClick={() => setOwner(ownerOption)}
                  className={`
                    flex-1 px-4 py-2 rounded-lg border-2 text-sm font-medium capitalize transition-all
                    ${
                      owner === ownerOption
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }
                  `}
                >
                  {ownerOption}
                </button>
              ))}
            </div>
          </div>

          {showSuccessMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              Task added successfully!
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={!title.trim() || submitting}
              className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Adding...' : 'Add Task'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg font-medium border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Done
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
