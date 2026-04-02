import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '@/lib/api';

interface Props {
  compact?: boolean;
}

export default function Leaderboard({ compact = false }: Props) {
  const { data } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => api.get('/leaderboard?limit=10').then((r) => r.data.leaderboard),
  });

  const rows = compact ? (data || []).slice(0, 5) : data || [];

  return (
    <div className="w-full">
      <div className="space-y-1">
        {rows.map((user: any, i: number) => (
          <motion.div
            key={user.username}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-white/5 transition-all ${
              i === 0 ? 'bg-green-500/5' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <span className={`w-6 text-center font-mono font-bold ${
                i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-orange-500' : 'text-white/20'
              }`}>
                {i + 1}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white tracking-tight">{user.username}</span>
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">{user.level || 'Script Kiddie'}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-mono font-bold text-green-500">{user.total_xp.toLocaleString()}</span>
              <span className="text-[10px] text-gray-600 block uppercase font-bold tracking-widest">XP</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      {rows.length === 0 && (
        <div className="py-12 text-center text-gray-600 text-sm italic">
          Fetching top operatives...
        </div>
      )}
    </div>
  );
}
