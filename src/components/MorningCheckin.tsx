import { useState, FormEvent } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getLogicalDateString } from '../lib/date-utils';
import { MoodSelector } from './MoodSelector';

interface MorningCheckinProps {
  userId: string;
  onComplete: () => void;
  onClose: () => void;
}

function getFormattedDate() {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}

export function MorningCheckin({ userId, onComplete, onClose }: MorningCheckinProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [gratitude1, setGratitude1] = useState('');
  const [gratitude2, setGratitude2] = useState('');
  const [gratitude3, setGratitude3] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedMood) return;

    setSubmitting(true);

    const gratitudes = [gratitude1, gratitude2, gratitude3]
      .map(g => g.trim())
      .filter(g => g.length > 0);

    const { error } = await supabase.from('daily_logs').upsert(
      {
        user_id: userId,
        log_date: getLogicalDateString(),
        morning_energy: selectedMood,
        morning_gratitudes: gratitudes,
        morning_timestamp: new Date().toISOString(),
      },
      { onConflict: 'user_id,log_date' }
    );

    setSubmitting(false);

    if (!error) {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-all"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="max-w-2xl w-full py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">
              Good Morning ☀️
            </h1>
            <p className="text-lg text-gray-600">{getFormattedDate()}</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
            <MoodSelector
              selectedMood={selectedMood}
              onSelectMood={setSelectedMood}
            />
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg space-y-4">
            <label className="block text-lg font-medium text-gray-900">
              3 things you're grateful for:
            </label>

            <div className="space-y-3">
              <input
                type="text"
                value={gratitude1}
                onChange={(e) => setGratitude1(e.target.value)}
                placeholder="1. I'm grateful for..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />

              <input
                type="text"
                value={gratitude2}
                onChange={(e) => setGratitude2(e.target.value)}
                placeholder="2. I'm grateful for..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />

              <input
                type="text"
                value={gratitude3}
                onChange={(e) => setGratitude3(e.target.value)}
                placeholder="3. I'm grateful for..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedMood || submitting}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2"
          >
            <span>{submitting ? 'Starting...' : 'Start My Day'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
