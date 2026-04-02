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
    if (levelFilter === 'all') return chapters;
    return chapters.filter((chapter) => (chapter.difficulty || '').toLowerCase() === levelFilter);
  }, [chapters, levelFilter]);

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
      ratio[chapterId] = value.total > 0 ? Math.round((value.completed / value.total) * 100) : 0;
    }
    return ratio;
  }, [progressRows]);

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl text-white font-bold">Chapter List</h1>
            <p className="text-gray-400 mt-1">Pick a chapter and continue your Linux security journey.</p>
          </div>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200"
          >
            {LEVEL_OPTIONS.map((level) => (
              <option key={level} value={level}>
                {level === 'all' ? 'All levels' : level[0].toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((chapter) => {
            const completion = completionByChapter[chapter.id] || 0;
            const userLevel = (user?.level || 'beginner').toLowerCase();
            const chapterLevel = (chapter.difficulty || 'beginner').toLowerCase();
            const locked = (chapterLevel === 'advanced' && userLevel === 'beginner') || chapterLevel === 'hacker';
            return (
              <Link
                key={chapter.id}
                href={locked ? '#' : `/learn/${chapter.id}`}
                className={`bg-gray-900 border rounded-xl p-5 transition ${locked ? 'border-gray-800 opacity-60 pointer-events-none' : 'border-gray-800 hover:border-terminal-green'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">{chapter.title}</h2>
                    <p className="text-sm text-gray-400 mt-2">{chapter.description || 'No description yet.'}</p>
                  </div>
                  <div
                    className="w-14 h-14 rounded-full grid place-items-center text-xs font-bold text-terminal-green"
                    style={{
                      background: `conic-gradient(#58d68d ${completion}%, #1f2937 ${completion}% 100%)`,
                    }}
                  >
                    <span className="w-10 h-10 rounded-full bg-gray-950 grid place-items-center">{completion}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-5 text-xs">
                  <span className="px-2 py-1 rounded bg-gray-800 text-gray-300 capitalize">
                    {chapter.difficulty || 'beginner'}
                  </span>
                  <span className="text-terminal-green font-mono">{locked ? 'Locked' : `+${chapter.xp_reward || 0} XP`}</span>
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
