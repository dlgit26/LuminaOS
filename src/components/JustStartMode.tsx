import { useState, useEffect } from 'react';
import { X, Rocket, CheckCircle } from 'lucide-react';
import { Database } from '../lib/database.types';

type Task = Database['public']['Tables']['tasks']['Row'];

interface JustStartModeProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onClose: () => void;
}

type TimerState = 'ready' | 'running' | 'completed';

const TIMER_DURATION = 120;

export function JustStartMode({ task, onComplete, onClose }: JustStartModeProps) {
  const [timerState, setTimerState] = useState<TimerState>('ready');
  const [endTime, setEndTime] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(TIMER_DURATION);

  useEffect(() => {
    if (timerState !== 'running' || !endTime) return;

    const interval = setInterval(() => {
      const left = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        setTimerState('completed');
      }
    }, 100);

    return () => clearInterval(interval);
  }, [timerState, endTime]);

  const startTimer = () => {
    setEndTime(Date.now() + TIMER_DURATION * 1000);
    setTimerState('running');
  };

  const handleDoneEarly = () => {
    setTimerState('completed');
  };

  const handleMarkComplete = () => {
    onComplete(task.id);
    onClose();
  };

  const handleKeepGoing = () => {
    setEndTime(Date.now() + TIMER_DURATION * 1000);
    setRemaining(TIMER_DURATION);
    setTimerState('running');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 z-50 flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="max-w-2xl w-full text-center space-y-8">
        {timerState === 'ready' && (
          <>
            <div className="space-y-4">
              <Rocket className="w-16 h-16 text-white mx-auto" />
              <h1 className="text-4xl font-bold text-white">
                Just do this one thing
              </h1>
            </div>

            <div className="bg-white/95 backdrop-blur rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {task.title}
              </h2>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium capitalize">
                  {task.task_type.replace('_', ' ')}
                </span>
                {task.streak_required && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                    Streak Required
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-2xl text-white font-medium">
                Can you do it for 2 minutes?
              </p>

              <button
                onClick={startTimer}
                className="bg-white text-purple-600 px-12 py-4 rounded-full text-xl font-bold hover:bg-purple-50 transition-all hover:scale-105 shadow-xl"
              >
                Start Timer
              </button>

              <button
                onClick={onClose}
                className="block mx-auto text-white/80 hover:text-white underline text-sm"
              >
                Skip this task
              </button>
            </div>
          </>
        )}

        {timerState === 'running' && (
          <>
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur rounded-3xl p-12 border-4 border-white/30">
                <div className="text-8xl font-bold text-white tabular-nums">
                  {formatTime(remaining)}
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-2xl">
                <h2 className="text-xl font-bold text-gray-900">
                  {task.title}
                </h2>
              </div>
            </div>

            <button
              onClick={handleDoneEarly}
              className="bg-white text-purple-600 px-8 py-3 rounded-full text-lg font-bold hover:bg-purple-50 transition-all hover:scale-105 shadow-xl"
            >
              I'm done early!
            </button>
          </>
        )}

        {timerState === 'completed' && (
          <>
            <div className="space-y-4">
              <div className="text-6xl">⏱️</div>
              <h1 className="text-4xl font-bold text-white">
                Time's up! How did it go?
              </h1>
            </div>

            <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-gray-900">
                {task.title}
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleMarkComplete}
                className="bg-white text-green-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-green-50 transition-all hover:scale-105 shadow-xl flex items-center gap-2 justify-center"
              >
                <CheckCircle className="w-6 h-6" />
                Done!
              </button>

              <button
                onClick={handleKeepGoing}
                className="bg-white/20 backdrop-blur text-white border-2 border-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white/30 transition-all hover:scale-105"
              >
                Keep going
              </button>

              <button
                onClick={onClose}
                className="bg-transparent text-white/80 px-8 py-4 rounded-full text-lg font-medium hover:text-white transition-all underline"
              >
                Didn't start
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
