import { Heart, Briefcase, Users, Palette, BookOpen, Home, DollarSign, Sparkles } from 'lucide-react';

export const AREAS = [
  { value: 'Health', label: 'Health', icon: Heart, color: 'bg-red-100 text-red-700' },
  { value: 'Work', label: 'Work', icon: Briefcase, color: 'bg-blue-100 text-blue-700' },
  { value: 'Relationships', label: 'Relationships', icon: Users, color: 'bg-pink-100 text-pink-700' },
  { value: 'Creativity', label: 'Creativity', icon: Palette, color: 'bg-purple-100 text-purple-700' },
  { value: 'Learning', label: 'Learning', icon: BookOpen, color: 'bg-green-100 text-green-700' },
  { value: 'Home', label: 'Home', icon: Home, color: 'bg-yellow-100 text-yellow-700' },
  { value: 'Finance', label: 'Finance', icon: DollarSign, color: 'bg-emerald-100 text-emerald-700' },
  { value: 'Spirituality', label: 'Spirituality', icon: Sparkles, color: 'bg-indigo-100 text-indigo-700' },
] as const;

interface AreaPickerProps {
  selectedArea: string | null;
  onSelectArea: (area: string | null) => void;
}

export function AreaPicker({ selectedArea, onSelectArea }: AreaPickerProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Life Area (optional)
      </label>

      <div className="grid grid-cols-2 gap-2">
        {AREAS.map((area) => {
          const Icon = area.icon;
          const isSelected = selectedArea === area.value;

          return (
            <button
              key={area.value}
              type="button"
              onClick={() => onSelectArea(isSelected ? null : area.value)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                transition-all border-2
                ${
                  isSelected
                    ? `${area.color} border-current`
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{area.label}</span>
            </button>
          );
        })}
      </div>

      {selectedArea && (
        <button
          type="button"
          onClick={() => onSelectArea(null)}
          className="text-xs text-gray-500 hover:text-gray-700 underline"
        >
          Clear area
        </button>
      )}
    </div>
  );
}

export function getAreaConfig(area: string | null) {
  if (!area) return null;
  return AREAS.find(a => a.value === area) || null;
}
