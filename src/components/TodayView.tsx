import { useState, useEffect } from 'react';
import { Plus, Rocket } from 'lucide-react';
import { StreakBadge } from './StreakBadge';
import { GentleModeToggle } from './GentleModeToggle';
import { CosmicWeather } from './CosmicWeather';
import { FoundationSection } from './FoundationSection';
import { TaskSection } from './TaskSection';
import { QuickCaptureModal } from './QuickCaptureModal';
import { JustStartMode } from './JustStartMode';
import { MorningCheckin } from './MorningCheckin';
import { EveningCheckin } from './EveningCheckin';
import { StreakMilestone } from './StreakMilestone';
import { SectionSkeleton, CosmicWeatherSkeleton } from './LoadingSkeleton';
import { AREAS } from './AreaPicker';
import { useTasks } from '../hooks/useTasks';
import { useDailyLog } from '../hooks/useDailyLog';
import { useStreak } from '../hooks/useStreak';
import { selectTaskForJustStart } from '../lib/task-selection';
import { supabase } from '../lib/supabase';
import { getLogicalDateString } from '../lib/date-utils';

interface TodayViewProps {
  userId: string;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
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

export function TodayView({ userId }: TodayViewProps) {
  const { tasks, loading: tasksLoading, toggleTask, refetch } = useTasks(userId);
  const { dailyLog, loading: logLoading, updateGentleMode } = useDailyLog(userId);
  const { streak, loading: streakLoading } = useStreak(userId);
  const [isGentleMode, setIsGentleMode] = useState(false);
  const [showQuickCapture, setShowQuickCapture] = useState(false);
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string | null>(null);
  const [justStartTask, setJustStartTask] = useState<typeof tasks[0] | null>(null);
  const [showMorningCheckin, setShowMorningCheckin] = useState(false);
  const [showEveningCheckin, setShowEveningCheckin] = useState(false);
  const [showStreakMilestone, setShowStreakMilestone] = useState<number | null>(null);

  useEffect(() => {
    if (dailyLog) {
      setIsGentleMode(dailyLog.is_gentle_mode);
    }
  }, [dailyLog]);

  useEffect(() => {
    const checkCheckins = async () => {
      const hour = new Date().getHours();
      const today = getLogicalDateString();

      const { data: log } = await supabase
        .from('daily_logs')
        .select('morning_timestamp, evening_timestamp')
        .eq('user_id', userId)
        .eq('log_date', today)
        .maybeSingle();

      if (hour < 12 && !log?.morning_timestamp) {
        setShowMorningCheckin(true);
      } else if (hour >= 20 && !log?.evening_timestamp) {
        setShowEveningCheckin(true);
      }
    };

    checkCheckins();
  }, [userId]);

  useEffect(() => {
    if (streak && [7, 14, 30, 50, 100].includes(streak.current_streak)) {
      const hasSeenMilestone = localStorage.getItem(`milestone_${streak.current_streak}_${userId}`);
      if (!hasSeenMilestone) {
        setShowStreakMilestone(streak.current_streak);
        localStorage.setItem(`milestone_${streak.current_streak}_${userId}`, 'true');
      }
    }
  }, [streak, userId]);

  const handleGentleModeToggle = async (value: boolean) => {
    setIsGentleMode(value);
    await updateGentleMode(value);
  };

  const handleJustStart = () => {
    const selectedTask = selectTaskForJustStart(tasks);
    if (selectedTask) {
      setJustStartTask(selectedTask);
    }
  };

  const handleJustStartComplete = async (taskId: string) => {
    await toggleTask(taskId, true);
    refetch();
  };

  const handleMorningCheckinComplete = () => {
    setShowMorningCheckin(false);
  };

  const handleEveningCheckinComplete = () => {
    setShowEveningCheckin(false);
  };

  const filteredTasks = selectedAreaFilter
    ? tasks.filter((task) => task.area === selectedAreaFilter)
    : tasks;

  const foundationTasks = filteredTasks.filter((task) => task.task_type === 'foundation');
  const regularTasks = filteredTasks.filter((task) =>
    ['routine', 'standard', 'deep_work'].includes(task.task_type)
  );

  if (tasksLoading || logLoading || streakLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-app)' }}>
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-64 animate-pulse" />
            </div>
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
          </div>

          <CosmicWeatherSkeleton />
          <SectionSkeleton />
          <SectionSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {getGreeting()}, Di
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={handleJustStart}
                disabled={tasks.filter(t => !t.completed).length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-pink-700 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Rocket className="w-4 h-4" />
                <span>Just Start</span>
              </button>
              <StreakBadge count={streak} />
            </div>
          </div>
          <p className="text-gray-600">{getFormattedDate()}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <GentleModeToggle
          isActive={isGentleMode}
          onToggle={handleGentleModeToggle}
        />

        <CosmicWeather userId={userId} />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-gray-700">Filter by area:</span>
            <button
              onClick={() => setSelectedAreaFilter(null)}
              className={`
                text-xs px-3 py-1.5 rounded-full font-medium transition-all
                ${
                  selectedAreaFilter === null
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {AREAS.map((area) => {
              const Icon = area.icon;
              const isSelected = selectedAreaFilter === area.value;
              return (
                <button
                  key={area.value}
                  onClick={() => setSelectedAreaFilter(isSelected ? null : area.value)}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                    transition-all
                    ${
                      isSelected
                        ? `${area.color}`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  <Icon className="w-3 h-3" />
                  <span>{area.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {foundationTasks.length > 0 && (
          <FoundationSection
            tasks={foundationTasks}
            isGentleMode={isGentleMode}
            onToggle={toggleTask}
          />
        )}

        <TaskSection
          tasks={regularTasks}
          isGentleMode={isGentleMode}
          onToggle={toggleTask}
        />
      </div>

      <button
        onClick={() => setShowQuickCapture(true)}
        className="fixed right-8 w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-40"
        style={{ bottom: 'calc(2rem + env(safe-area-inset-bottom))' }}
        aria-label="Add task"
      >
        <Plus className="w-6 h-6" />
      </button>

      {showQuickCapture && (
        <QuickCaptureModal
          onClose={() => setShowQuickCapture(false)}
          onTaskCreated={refetch}
        />
      )}

      {justStartTask && (
        <JustStartMode
          task={justStartTask}
          onComplete={handleJustStartComplete}
          onClose={() => setJustStartTask(null)}
        />
      )}

      {showMorningCheckin && (
        <MorningCheckin
          userId={userId}
          onComplete={handleMorningCheckinComplete}
          onClose={() => setShowMorningCheckin(false)}
        />
      )}

      {showEveningCheckin && (
        <EveningCheckin
          userId={userId}
          onComplete={handleEveningCheckinComplete}
          onClose={() => setShowEveningCheckin(false)}
        />
      )}

      {showStreakMilestone && (
        <StreakMilestone
          streak={showStreakMilestone}
          onClose={() => setShowStreakMilestone(null)}
        />
      )}
    </div>
  );
}
