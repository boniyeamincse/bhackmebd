import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import XPBar from '@/components/gamification/XPBar';
import BadgeGallery from '@/components/gamification/BadgeGallery';
import { withAuth } from '@/components/auth/withAuth';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';

type ProgressRow = { chapterId: string | null; status: string };

function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  const { data } = useQuery<{ progress: ProgressRow[] }>({
    queryKey: ['profile-progress'],
    queryFn: () => api.get('/progress').then((r) => r.data),
    enabled: !!token,
  });

  const completedChapters = useMemo(() => {
    const rows = data?.progress || [];
    const byChapter = new Map<string, boolean>();

    for (const row of rows) {
      if (!row.chapterId) continue;
      if (!byChapter.has(row.chapterId)) byChapter.set(row.chapterId, true);
      if (row.status !== 'completed') byChapter.set(row.chapterId, false);
    }

    return Array.from(byChapter.entries()).filter(([, done]) => done).map(([id]) => id);
  }, [data]);

  if (!user || !token) return null;

  const handleAvatarChange = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const avatar = typeof reader.result === 'string' ? reader.result : null;
      setPreviewAvatar(avatar);
      setAuth({ ...user, avatar_url: avatar || user.avatar_url }, token, refreshToken);
    };
    reader.readAsDataURL(file);
  };

  const avatar = previewAvatar || user.avatar_url || null;

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold text-white">Profile</h1>

        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gray-800 overflow-hidden grid place-items-center text-terminal-green text-xl font-bold">
              {avatar ? <img src={avatar} alt={user.username} className="w-full h-full object-cover" /> : user.username.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-white text-xl font-semibold">{user.username}</p>
              <p className="text-gray-400 text-sm">{user.email}</p>
              <div className="mt-3"><XPBar xp={user.total_xp} /></div>
            </div>
            <label className="md:ml-auto text-sm px-3 py-2 rounded border border-gray-700 text-gray-300 hover:bg-gray-800 cursor-pointer">
              Upload Avatar
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleAvatarChange(e.target.files?.[0])} />
            </label>
          </div>
        </section>

        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-white text-lg font-semibold mb-3">Completed Chapters</h2>
          {completedChapters.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {completedChapters.map((id) => (
                <span key={id} className="px-3 py-1 rounded-full text-xs bg-green-950/30 border border-terminal-green text-terminal-green font-mono">
                  {id.slice(0, 8)}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No completed chapters yet.</p>
          )}
        </section>

        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-white text-lg font-semibold mb-3">Badge Gallery</h2>
          <BadgeGallery earned={user.badges || []} />
        </section>
      </main>
    </div>
  );
}

export default withAuth(ProfilePage);
