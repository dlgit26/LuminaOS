interface TaskTypeSelectorProps {
  selectedType: 'foundation' | 'routine' | 'standard' | 'deep_work';
  onSelect: (type: 'foundation' | 'routine' | 'standard' | 'deep_work') => void;
}

const taskTypes = [
  {
    value: 'foundation' as const,
    label: 'Foundation (Anchor)',
    color: 'purple',
    bgClass: 'bg-purple-50',
    borderClass: 'border-purple-500',
    textClass: 'text-purple-700',
  },
  {
    value: 'routine' as const,
    label: 'Routine',
    color: 'mint',
    bgClass: 'bg-teal-50',
    borderClass: 'border-teal-500',
    textClass: 'text-teal-700',
  },
  {
    value: 'standard' as const,
    label: 'Standard',
    color: 'gray',
    bgClass: 'bg-gray-50',
    borderClass: 'border-gray-500',
    textClass: 'text-gray-700',
  },
  {
    value: 'deep_work' as const,
    label: 'Deep Work',
    color: 'plum',
    bgClass: 'bg-violet-50',
    borderClass: 'border-violet-500',
    textClass: 'text-violet-700',
  },
];

export function TaskTypeSelector({ selectedType, onSelect }: TaskTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {taskTypes.map((type) => (
        <button
          key={type.value}
          type="button"
          onClick={() => onSelect(type.value)}
          className={`
            px-4 py-3 rounded-lg border-2 transition-all text-center text-sm font-medium
            ${
              selectedType === type.value
                ? `${type.borderClass} ${type.bgClass} ${type.textClass}`
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }
          `}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
}
