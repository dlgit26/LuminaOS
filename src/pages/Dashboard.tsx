import { useAuth } from '../contexts/AuthContext';
import { LogOut, Sparkles } from 'lucide-react';
import { TodayView } from '../components/TodayView';

export default function Dashboard() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h1 className="text-2xl font-light text-gray-900">
              Lumina
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.email}
            </span>
            <button
              onClick={signOut}
              className="p-2 rounded-lg transition-all hover:opacity-70 text-gray-600"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {user && <TodayView userId={user.id} />}
    </div>
  );
}
