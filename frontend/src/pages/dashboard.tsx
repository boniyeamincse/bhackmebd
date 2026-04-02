import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import Navbar from '@/components/layout/Navbar';
import XPBar from '@/components/gamification/XPBar';
import LevelBadge from '@/components/gamification/LevelBadge';

export default function Dashboard() {
  const router = useRouter();
  const { user, token } = useAuthStore();

  useEffect(() => {
    if (!token) router.push('/login');
  }, [token, router]);

  const { data } = useQuery({
    queryKey: ['chapters'],
    queryFn: () => api.get('/chapters').then((r) => r.data.chapters),
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

        <h2 className="text-xl font-bold text-terminal-green mb-4 font-mono">Chapters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.map((chapter: any) => (
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
