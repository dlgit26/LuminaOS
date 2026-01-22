import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getLogicalDateString } from '../lib/date-utils';

interface TransitFeedbackProps {
  userId: string;
  transitType: string;
  transitingPlanet: string;
  natalPoint: string;
  aspect: string;
}

type Resonance = 'positive' | 'negative' | 'neutral';

export function TransitFeedback({
  userId,
  transitType,
  transitingPlanet,
  natalPoint,
  aspect,
}: TransitFeedbackProps) {
  const [selectedResonance, setSelectedResonance] = useState<Resonance | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFeedback = async (resonance: Resonance) => {
    setSaving(true);
    setSelectedResonance(resonance);

    const { error } = await supabase.from('transit_feedback').insert({
      user_id: userId,
      log_date: getLogicalDateString(),
      transit_type: transitType,
      transiting_planet: transitingPlanet,
      natal_point: natalPoint,
      aspect,
      resonance,
    });

    setSaving(false);

    if (error) {
      console.error('Error saving feedback:', error);
      setSelectedResonance(null);
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      <button
        onClick={() => handleFeedback('positive')}
        disabled={saving}
        className={`
          p-2 rounded-lg transition-all
          ${
            selectedResonance === 'positive'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        aria-label="Resonates positively"
      >
        <ThumbsUp className="w-4 h-4" />
      </button>

      <button
        onClick={() => handleFeedback('neutral')}
        disabled={saving}
        className={`
          p-2 rounded-lg transition-all
          ${
            selectedResonance === 'neutral'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        aria-label="Neutral"
      >
        <Minus className="w-4 h-4" />
      </button>

      <button
        onClick={() => handleFeedback('negative')}
        disabled={saving}
        className={`
          p-2 rounded-lg transition-all
          ${
            selectedResonance === 'negative'
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        aria-label="Does not resonate"
      >
        <ThumbsDown className="w-4 h-4" />
      </button>

      {selectedResonance && (
        <span className="text-xs text-gray-500 self-center ml-1">Saved</span>
      )}
    </div>
  );
}
