import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import { withAuth } from '@/components/auth/withAuth';
import api from '@/lib/api';

type Row = {
  username: string;
  total_xp: number;
  level: string;
  avatar_url?: string | null;
};

function LeaderboardPage() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data } = useQuery<{ leaderboard: Row[]; pagination: { totalPages: number } }>({
    queryKey: ['leaderboard-page', page],
    queryFn: () => api.get(`/leaderboard?page=${page}&limit=${limit}`).then((r) => r.data),
  });

  const rows = data?.leaderboard || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const rankEmojis = useMemo(() => ['🥇', '🥈', '🥉'], []);

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Leaderboard</h1>
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="text-left px-4 py-3">Rank</th>
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3">Level</th>
                <th className="text-right px-4 py-3">XP</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const rank = (page - 1) * limit + i + 1;
                return (
                  <tr key={`${row.username}-${rank}`} className="border-t border-gray-800">
                    <td className="px-4 py-3 text-gray-300">{rank <= 3 ? rankEmojis[rank - 1] : `#${rank}`}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-800 grid place-items-center text-terminal-green text-xs">
                          {row.avatar_url ? <img src={row.avatar_url} alt={row.username} className="w-8 h-8 rounded-full object-cover" /> : row.username.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-white">{row.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-300 capitalize">{row.level}</td>
                    <td className="px-4 py-3 text-right text-terminal-green font-mono">{row.total_xp}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded border border-gray-700 text-sm text-gray-300 disabled:opacity-40"
          >
            Previous
          </button>
          <p className="text-gray-400 text-sm">Page {page} / {totalPages}</p>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1 rounded border border-gray-700 text-sm text-gray-300 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}

export default withAuth(LeaderboardPage);
