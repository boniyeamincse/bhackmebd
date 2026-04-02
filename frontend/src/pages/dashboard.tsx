import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import Navbar from '@/components/layout/Navbar';
import XPBar from '@/components/gamification/XPBar';
import LevelBadge from '@/components/gamification/LevelBadge';
import { withAuth } from '@/components/auth/withAuth';

function Dashboard() {
  const { user, token } = useAuthStore();

  const { data } = useQuery({
    queryKey: ['chapters'],
    queryFn: () => api.get('/chapters').then((r) => r.data.chapters),
    enabled: !!token,
  });

  const { data: stats } = useQuery({
    queryKey: ['progress-stats'],
    queryFn: () => api.get('/progress/stats').then((r) => r.data.stats),
    enabled: !!token,
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <LevelBadge level={user.level} />
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome, {user.username}</h1>
            <XPBar xp={user.total_xp} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Total XP</p>
            <p className="text-2xl font-bold text-terminal-green">{stats?.total_xp ?? user.total_xp}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Active Streak</p>
            <p className="text-2xl font-bold text-white">{stats?.streak ?? 0} days</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Badges</p>
            <p className="text-2xl font-bold text-white">{stats?.badgeCount ?? user.badges?.length ?? 0}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-terminal-green font-mono">Recent Chapters</h2>
          <Link href="/chapters" className="text-sm text-gray-300 hover:text-white">View all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.slice(0, 4).map((chapter: any) => (
            <Link key={chapter.id} href={`/learn/${chapter.id}`}
              className="bg-gray-900 rounded-xl p-5 hover:ring-2 hover:ring-terminal-green transition">
              <h3 className="text-white font-bold">{chapter.title}</h3>
              <p className="text-gray-400 text-sm mt-1">{chapter.description}</p>
              <span className="text-terminal-green text-xs mt-2 inline-block">+{chapter.xp_reward} XP</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default withAuth(Dashboard);
