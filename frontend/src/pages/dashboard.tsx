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
        <div className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-gray-900/40 p-8 rounded-[2rem] border border-white/5 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity">
             <svg className="w-64 h-64 text-terminal-green" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <div className="w-24 h-24 rounded-[1.5rem] bg-gray-800 border-[3px] border-white/10 overflow-hidden flex items-center justify-center shadow-2xl relative group/avatar">
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url.startsWith('http') ? user.avatar_url : `${process.env.NEXT_PUBLIC_API_URL || ''}${user.avatar_url}`} 
                    alt={user.username} 
                    className="w-full h-full object-cover grayscale-[0.3] group-hover/avatar:grayscale-0 transition-all duration-500" 
                  />
                ) : (
                  <span className="text-3xl font-black text-terminal-green/30">{user.username.slice(0, 1).toUpperCase()}</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
              </div>
              <div className="absolute -bottom-2 -right-2 transform scale-75 origin-bottom-right">
                 <LevelBadge level={user.level} />
              </div>
            </motion.div>

            <div className="text-center md:text-left">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex flex-col md:flex-row md:items-baseline gap-3 mb-1"
              >
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
                  SECURE SESSION: {user.username}
                </h1>
                <span className="bg-terminal-green/10 text-terminal-green text-[10px] px-2 py-0.5 rounded border border-terminal-green/30 font-bold uppercase tracking-widest self-center md:self-baseline">
                  {user.role}
                </span>
              </motion.div>
              
              <p className="text-xl text-gray-400 font-medium tracking-tight mb-4">{user.full_name || 'Designation Pending'}</p>
              
              <div className="w-full max-w-md">
                <XPBar xp={user.total_xp} />
              </div>
            </div>
          </div>
          
          <Link href="/chapters" className="relative group/btn z-10 shrink-0">
            <div className="absolute inset-0 bg-terminal-green/20 blur-xl rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
            <div className="bg-terminal-green text-black font-black px-8 py-4 rounded-xl flex items-center gap-3 transition-all active:scale-95 shadow-[0_4px_20px_rgba(0,255,159,0.2)]">
              <span className="uppercase tracking-widest text-xs">Resume Operations</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
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
