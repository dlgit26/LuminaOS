interface Mood {
  value: number;
  emoji: string;
  label: string;
}

const MOODS: Mood[] = [
  { value: 1, emoji: '😴', label: 'Tired' },
  { value: 2, emoji: '😕', label: 'Meh' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '⚡', label: 'Energized' },
];

interface MoodSelectorProps {
  selectedMood: number | null;
  onSelectMood: (mood: number) => void;
  label?: string;
}

export function MoodSelector({ selectedMood, onSelectMood, label = "How are you feeling?" }: MoodSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block text-lg font-medium text-gray-900">
        {label}
      </label>

      <div className="flex justify-between gap-3">
        {MOODS.map((mood) => (
          <button
            key={mood.value}
            type="button"
            onClick={() => onSelectMood(mood.value)}
            className={`
              flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all flex-1
              ${
                selectedMood === mood.value
                  ? 'border-purple-500 bg-purple-50 scale-105'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <span className="text-4xl mb-2">{mood.emoji}</span>
            <span className="text-sm font-medium text-gray-700">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
