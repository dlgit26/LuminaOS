import { useState, FormEvent } from 'react';
import { X, ArrowRight, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getLogicalDateString } from '../lib/date-utils';
import { MoodSelector } from './MoodSelector';

interface EveningCheckinProps {
  userId: string;
  onComplete: () => void;
  onClose: () => void;
}

type Tier = 1 | 2 | 3;

export function EveningCheckin({ userId, onComplete, onClose }: EveningCheckinProps) {
  const [tier, setTier] = useState<Tier>(1);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [wins, setWins] = useState('');
  const [challenges, setChallenges] = useState('');
  const [tomorrow, setTomorrow] = useState('');
  const [journal, setJournal] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleTier1Submit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedMood) return;

    setSubmitting(true);

    const { error } = await supabase.from('daily_logs').upsert(
      {
        user_id: userId,
        log_date: getLogicalDateString(),
        evening_mood: selectedMood,
        evening_timestamp: new Date().toISOString(),
      },
      { onConflict: 'user_id,log_date' }
    );

    setSubmitting(false);

    if (!error) {
      onComplete();
    }
  };

  const handleTier2Submit = async (e: FormEvent) => {
    e.preventDefault();

    setSubmitting(true);

    const { error } = await supabase.from('daily_logs').upsert(
      {
        user_id: userId,
        log_date: getLogicalDateString(),
        reflection_wins: wins.trim() || null,
        reflection_challenges: challenges.trim() || null,
        reflection_tomorrow: tomorrow.trim() || null,
      },
      { onConflict: 'user_id,log_date' }
    );

    setSubmitting(false);

    if (!error) {
      onComplete();
    }
  };

  const handleTier3Submit = async (e: FormEvent) => {
    e.preventDefault();

    setSubmitting(true);

    const { error } = await supabase.from('daily_logs').upsert(
      {
        user_id: userId,
        log_date: getLogicalDateString(),
        journal_entry: journal.trim() || null,
      },
      { onConflict: 'user_id,log_date' }
    );

    setSubmitting(false);

    if (!error) {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-all"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="max-w-2xl w-full py-8">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Evening Reflection 🌙
          </h1>

          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((t) => (
              <div
                key={t}
                className={`
                  w-3 h-3 rounded-full transition-all
                  ${tier >= t ? 'bg-purple-600' : 'bg-gray-300'}
                `}
              />
            ))}
          </div>
        </div>

        {tier === 1 && (
          <form onSubmit={handleTier1Submit} className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
              <MoodSelector
                selectedMood={selectedMood}
                onSelectMood={setSelectedMood}
                label="How are you feeling tonight?"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!selectedMood || submitting}
                className="flex-1 bg-gray-800 text-white px-6 py-4 rounded-xl text-lg font-bold hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {submitting ? 'Saving...' : 'Done'}
              </button>

              <button
                type="button"
                onClick={() => setTier(2)}
                disabled={!selectedMood}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl text-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
              >
                <span>Reflect More</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}

        {tier === 2 && (
          <form onSubmit={handleTier2Submit} className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-3">
                  What went well today?
                </label>
                <textarea
                  value={wins}
                  onChange={(e) => setWins(e.target.value)}
                  placeholder="Celebrate your wins..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-900 mb-3">
                  What was challenging?
                </label>
                <textarea
                  value={challenges}
                  onChange={(e) => setChallenges(e.target.value)}
                  placeholder="What obstacles did you face?"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-900 mb-3">
                  One thing for tomorrow?
                </label>
                <input
                  type="text"
                  value={tomorrow}
                  onChange={(e) => setTomorrow(e.target.value)}
                  placeholder="What's one priority for tomorrow?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gray-800 text-white px-6 py-4 rounded-xl text-lg font-bold hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>{submitting ? 'Saving...' : 'Complete'}</span>
              </button>

              <button
                type="button"
                onClick={() => setTier(3)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl text-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Write More</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}

        {tier === 3 && (
          <form onSubmit={handleTier3Submit} className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <label className="block text-lg font-medium text-gray-900 mb-3">
                Free write...
              </label>
              <textarea
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                placeholder="Let your thoughts flow freely. No structure needed, just write what's on your mind..."
                rows={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{submitting ? 'Saving...' : 'Save Entry'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
