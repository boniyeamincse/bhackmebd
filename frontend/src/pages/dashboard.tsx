import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import Navbar from '@/components/layout/Navbar';
import XPBar from '@/components/gamification/XPBar';
import LevelBadge from '@/components/gamification/LevelBadge';
import StreakCalendar from '@/components/gamification/StreakCalendar';
import Leaderboard from '@/components/gamification/Leaderboard';
import { withAuth } from '@/components/auth/withAuth';

function Dashboard() {
  const { user, token } = useAuthStore();

  const { data: chapters } = useQuery({
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
    <div className="min-h-screen bg-[#05070a] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 blur-[120px] rounded-full" />
      
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-12 relative z-10">
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-glow" />
              <LevelBadge level={user.level} />
            </motion.div>
            <div>
              <motion.h1 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-4xl font-bold text-white mb-2 tracking-tight"
              >
                Welcome, {user.username}
              </motion.h1>
              <div className="w-full max-w-md">
                <XPBar xp={user.total_xp} />
              </div>
            </div>
          </div>
          
          <Link href="/chapters" className="bg-green-500 text-black font-bold px-6 py-3 rounded-xl hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)] text-center">
            Continue Learning
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Experience', value: `${stats?.total_xp ?? user.total_xp} XP`, icon: '💎', color: 'text-green-500' },
            { label: 'Learning Streak', value: `${stats?.streak ?? 0} Days`, icon: '🔥', color: 'text-orange-500' },
            { label: 'Achievements', value: `${stats?.badgeCount ?? user.badges?.length ?? 0} Badges`, icon: '🏅', color: 'text-blue-500' },
            { label: 'Current Rank', value: user.level, icon: '⚔️', color: 'text-purple-500' },
          ].map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-2xl border border-white/5 group hover:border-white/10 transition-all"
            >
              <div className="text-2xl mb-4">{s.icon}</div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color} tracking-tight`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white tracking-tight">Active Learning Tracks</h2>
                <Link href="/chapters" className="text-sm font-bold text-green-500 hover:text-green-400 transition-colors uppercase tracking-widest">Explore All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chapters?.slice(0, 4).map((chapter: any, i: number) => (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                  >
                    <Link href={`/learn/${chapter.id}`}
                      className="block group glass p-6 rounded-2xl border border-white/5 hover:border-green-500/30 transition-all relative overflow-hidden h-full"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl rounded-full group-hover:bg-green-500/10 transition-all" />
                      <div className="relative z-10">
                        <span className="text-[10px] font-bold text-green-500/60 uppercase tracking-widest mb-2 block">Chapter {i + 1}</span>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors uppercase tracking-tighter">{chapter.title}</h3>
                        <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">{chapter.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-green-500">+{chapter.xp_reward} XP</span>
                          <span className="text-xs font-bold text-white group-hover:translate-x-1 transition-transform">Begin Lab →</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <section className="glass p-6 rounded-2xl border border-white/5">
              <h3 className="text-lg font-bold text-white mb-6 tracking-tight">Activity Heatmap</h3>
              <StreakCalendar streakDays={stats?.streak ?? 0} />
            </section>

            <section className="glass rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h3 className="text-lg font-bold text-white tracking-tight">Top Operatives</h3>
              </div>
              <Leaderboard compact />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuth(Dashboard);
