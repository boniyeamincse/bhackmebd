import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export default function Leaderboard() {
  const { data } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => api.get('/progress/leaderboard').then((r) => r.data.leaderboard),
  });

  return (
    <div className="bg-gray-900 rounded-xl p-5">
      <h2 className="text-terminal-green font-bold font-mono mb-4">🏆 Leaderboard</h2>
      <ol className="space-y-2">
        {data?.map((user: any, i: number) => (
          <li key={user.username} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 w-5">{i + 1}</span>
              <span className="text-white">{user.username}</span>
            </div>
            <span className="text-terminal-green font-mono">{user.total_xp} XP</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
