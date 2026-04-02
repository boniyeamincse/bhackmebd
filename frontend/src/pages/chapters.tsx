import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import { withAuth } from '@/components/auth/withAuth';
import { useAuthStore } from '@/store/auth.store';

type Chapter = {
  id: string;
  title: string;
  description?: string;
  level?: string;
  difficulty?: string;
  xp_reward?: number;
};

type ProgressRow = {
  chapterId: string | null;
  status: string;
};

const LEVEL_OPTIONS = ['all', 'beginner', 'intermediate', 'advanced', 'hacker'];

function ChapterListPage() {
  const [levelFilter, setLevelFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const user = useAuthStore((s) => s.user);

  const { data: chapters = [] } = useQuery<Chapter[]>({
    queryKey: ['chapters-list'],
    queryFn: () => api.get('/chapters?limit=50').then((r) => r.data.chapters),
  });

  const { data: progressRows = [] } = useQuery<ProgressRow[]>({
    queryKey: ['progress-map'],
    queryFn: () => api.get('/progress').then((r) => r.data.progress),
  });

  const filtered = useMemo(() => {
    return chapters.filter((chapter) => {
      const chapterLevel = (chapter.level || chapter.difficulty || '').toLowerCase();
      const matchesLevel = levelFilter === 'all' || chapterLevel === levelFilter;
      const matchesSearch = chapter.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesLevel && matchesSearch;
    });
  }, [chapters, levelFilter, searchQuery]);

  const completionByChapter = useMemo(() => {
    const bucket: Record<string, { total: number; completed: number }> = {};
    for (const row of progressRows) {
      if (!row.chapterId) continue;
      if (!bucket[row.chapterId]) bucket[row.chapterId] = { total: 0, completed: 0 };
      bucket[row.chapterId].total += 1;
      if (row.status === 'completed') bucket[row.chapterId].completed += 1;
    }

    const ratio: Record<string, number> = {};
    for (const [chapterId, value] of Object.entries(bucket)) {
      ratio[chapterId] = value.total > 0 ? Math.round((value.completed / value.total) ? (value.completed / value.total) * 100 : 0) : 0;
    }
    return ratio;
  }, [progressRows]);

  const getDifficultyColor = (level: string = 'beginner') => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'advanced': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'hacker': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-gray-200">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col gap-8 mb-12">
          <div className="border-l-4 border-terminal-green pl-6">
            <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">Active Labs</h1>
            <p className="text-gray-500 font-mono text-sm mt-2">Select a virtual environment to begin your operation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 relative">
              <input
                type="text"
                placeholder="SEARCH LAB BY BOX NAME..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-sm font-mono focus:border-terminal-green/50 focus:ring-0 transition-all placeholder:text-gray-600"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">🔍</span>
            </div>
            <div className="md:col-span-4">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm font-mono text-gray-300 focus:border-terminal-green/50 transition-all"
              >
                {LEVEL_OPTIONS.map((level) => (
                  <option key={level} value={level} className="bg-[#0a0c10]">
                    {level === 'all' ? '--- ALL DIFFICULTIES ---' : `${level.toUpperCase()} LEVEL`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((chapter) => {
            const completion = completionByChapter[chapter.id] || 0;
            const chapterLevel = chapter.level || chapter.difficulty || 'beginner';
            const diffColor = getDifficultyColor(chapterLevel);
            const locked = false; // Simplified for now as requested labs should be accessible

            return (
              <Link
                key={chapter.id}
                href={`/learn/${chapter.id}`}
                className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-500 hover:border-terminal-green/50 hover:bg-white/10 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-terminal-green/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-terminal-green/10 transition-all" />
                
                <div className="flex justify-between items-start mb-6">
                  <span className={`text-[10px] font-black px-2 py-1 rounded border uppercase tracking-widest ${diffColor}`}>
                    {chapterLevel}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">ID: {chapter.id.slice(0, 8)}</span>
                </div>

                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-terminal-green transition-colors leading-tight">
                  {chapter.title}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-2 h-10 mb-6 font-medium">
                  {chapter.description || 'Virtual lab environment for practical Linux exercises.'}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-gray-600 font-bold tracking-widest mb-1">XP Reward</span>
                    <span className="text-terminal-green font-mono font-bold">+{chapter.xp_reward || 0} XP</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-gray-600 font-bold tracking-widest mb-1 block">Progress</span>
                    <span className="text-white font-mono font-bold">{completion}%</span>
                  </div>
                </div>

                <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-terminal-green transition-all duration-1000"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default withAuth(ChapterListPage);
