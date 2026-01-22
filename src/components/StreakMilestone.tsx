import { Flame, Gift } from 'lucide-react';

interface StreakMilestoneProps {
  streak: number;
  onClose: () => void;
}

const milestones: Record<number, { title: string; message: string }> = {
  7: {
    title: '7 Day Streak!',
    message: "One week of consistency! You've earned a freeze day.",
  },
  14: {
    title: '14 Day Streak!',
    message: "Two weeks strong! You're building lasting habits.",
  },
  30: {
    title: '30 Day Streak!',
    message: "One month of dedication! You've earned another freeze.",
  },
  50: {
    title: '50 Day Streak!',
    message: "Incredible consistency! You're unstoppable!",
  },
  100: {
    title: '100 Day Streak!',
    message: "Century milestone! You're a legend!",
  },
};

export function StreakMilestone({ streak, onClose }: StreakMilestoneProps) {
  const milestone = milestones[streak];

  if (!milestone) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-bounce-in">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center animate-pulse-glow">
                <Flame className="w-12 h-12 text-white" fill="currentColor" />
              </div>
              <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2">
                <Gift className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">
              {milestone.title}
            </h2>
            <p className="text-lg text-gray-600">{milestone.message}</p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
          >
            Keep Going!
          </button>
        </div>
      </div>
    </div>
  );
}
