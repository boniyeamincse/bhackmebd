import { useMemo, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import XPBar from '@/components/gamification/XPBar';
import BadgeGallery from '@/components/gamification/BadgeGallery';
import { withAuth } from '@/components/auth/withAuth';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';

type ProgressRow = { chapterId: string | null; lessonId?: string | null; taskId?: string | null; status: string };

function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);
  const refreshToken = useAuthStore((s) => s.refreshToken);

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading: progressLoading } = useQuery<{ progress: ProgressRow[] }>({
    queryKey: ['profile-progress'],
    queryFn: () => api.get('/progress').then((r) => r.data),
    enabled: !!token,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: { full_name: string }) => api.put('/auth/profile', data),
    onSuccess: (res) => {
      setAuth(res.data.user, token!, refreshToken);
      setIsEditing(false);
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (avatar: string) => api.post('/auth/avatar', { avatar }),
    onSuccess: (res) => {
      setAuth(res.data.user, token!, refreshToken);
    },
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

  const progressStats = useMemo(() => {
    const rows = data?.progress || [];
    const completed = rows.filter((r) => r.status === 'completed').length;
    const total = rows.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      totalTasksTracked: total,
      completedTasks: completed,
      completionRate,
    };
  }, [data]);

  if (!user || !token) return null;

  const handleAvatarChange = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = typeof reader.result === 'string' ? reader.result : null;
      if (base64) uploadAvatarMutation.mutate(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({ full_name: fullName });
  };

  const avatar = user.avatar_url ? (user.avatar_url.startsWith('http') ? user.avatar_url : `${process.env.NEXT_PUBLIC_API_URL || ''}${user.avatar_url}`) : null;
  const safeUserId = String(user.id || 'unknown');
  const safeUsername = String(user.username || 'user');

  return (
    <div className="min-h-screen bg-[#05070a] text-gray-200">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pt-24 pb-12 md:pt-28 space-y-8">
        <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/[0.02] to-terminal-green/5 px-6 py-8 md:px-8">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-terminal-green/10 blur-3xl pointer-events-none" />
          <p className="text-gray-500 font-mono uppercase tracking-[0.25em] text-[10px]">Operator Profile</p>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none uppercase mt-2">Mission Control</h1>
          <p className="text-gray-300 mt-3 font-medium text-sm">Identity, rank progression, and chapter completion intelligence for {safeUsername}.</p>
        </header>

        <section className="relative overflow-hidden bg-gray-900/30 border border-white/5 rounded-3xl p-8 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
             <svg className="w-80 h-80 text-terminal-green" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            <div className="relative">
              <div className="w-40 h-40 rounded-[2.5rem] bg-gray-800 border-[3px] border-white/10 overflow-hidden flex items-center justify-center transition-all duration-500 group relative">
                {avatar ? (
                  <img src={avatar} alt={safeUsername} className="w-full h-full object-cover grayscale-[0.5] hover:grayscale-0 transition-all duration-500" />
                ) : (
                  <span className="text-6xl font-black text-terminal-green/30 select-none">{safeUsername.slice(0, 1).toUpperCase()}</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-terminal-green shadow-[0_0_12px_rgba(0,255,159,0.8)]" title="Online" />
              <label className="absolute -bottom-3 -right-3 bg-terminal-green text-black p-3 rounded-2xl cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,159,0.3)] border-4 border-[#05070a]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleAvatarChange(e.target.files?.[0])} />
              </label>
              {uploadAvatarMutation.isPending && (
                <p className="text-[10px] mt-6 text-terminal-green font-mono uppercase tracking-wider text-center">Uploading avatar...</p>
              )}
            </div>

            <div className="flex-1 text-center md:text-left space-y-6">
              <div>
                <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-1">
                  <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">{safeUsername}</h2>
                  <div className="flex gap-2">
                    <span className="bg-terminal-green/10 text-terminal-green text-[10px] px-2 py-0.5 rounded border border-terminal-green/30 font-bold uppercase tracking-widest">{user.role}</span>
                    <span className="bg-white/5 text-white/40 text-[10px] px-2 py-0.5 rounded border border-white/10 font-bold uppercase tracking-widest">UID: {safeUserId.slice(0, 8)}</span>
                  </div>
                </div>
                <p className="text-gray-500 font-mono text-sm tracking-tight">{user.email}</p>
              </div>

              <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Deployment Identity</p>
                {isEditing ? (
                  <div className="flex gap-2 max-w-md">
                    <input 
                      type="text" 
                      value={fullName}
                      autoFocus
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white w-full focus:outline-none focus:border-terminal-green/50 transition-all font-medium"
                      placeholder="Enter Full Name"
                    />
                    <button
                      onClick={handleSaveProfile}
                      disabled={updateProfileMutation.isPending}
                      className="bg-terminal-green text-black px-6 py-2 rounded-xl font-black text-xs hover:shadow-[0_0_20px_rgba(0,255,159,0.4)] transition-all disabled:opacity-60"
                    >
                      {updateProfileMutation.isPending ? 'SAVING' : 'SAVE'}
                    </button>
                    <button onClick={() => setIsEditing(false)} className="bg-white/5 text-gray-400 px-4 py-2 rounded-xl font-bold text-xs border border-white/10 hover:bg-white/10 transition-all">ESC</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 group/name">
                    <p className="text-2xl text-gray-200 font-medium tracking-tight">{user.full_name || 'Designation Pending'}</p>
                    <button onClick={() => setIsEditing(true)} className="text-gray-600 hover:text-terminal-green opacity-0 group-hover/name:opacity-100 transition-all p-2 hover:bg-white/5 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-2 max-w-xl">
                <XPBar xp={user.total_xp} />
                <div className="flex justify-between mt-2 font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-terminal-green"></span> Level: {user.level}</span>
                  <span>Total XP: {user.total_xp}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid md:grid-cols-12 gap-8">
          <section className="md:col-span-8 bg-gray-900/30 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md">
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs underline decoration-terminal-green/50 underline-offset-8">Commendations</h3>
              <span className="text-[10px] font-mono font-bold text-terminal-green bg-terminal-green/10 px-3 py-1 rounded-full border border-terminal-green/20">
                {user.badges?.length || 0} DEPLOYED
              </span>
            </div>
            <div className="p-8">
              <BadgeGallery earned={user.badges || []} />
            </div>
          </section>

          <section className="md:col-span-4 bg-gray-900/30 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md flex flex-col">
            <div className="px-8 py-6 border-b border-white/5 bg-white/5">
              <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs underline decoration-terminal-green/50 underline-offset-8">Mission Status</h3>
            </div>
            <div className="p-8 space-y-8 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 text-center group hover:border-terminal-green/30 transition-all cursor-default">
                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-2 tracking-widest">Chapters</p>
                  <p className="text-3xl font-black text-white group-hover:text-terminal-green transition-colors">{completedChapters.length}</p>
                </div>
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 text-center group hover:border-terminal-green/30 transition-all cursor-default">
                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-2 tracking-widest">Tasks Done</p>
                  <p className="text-3xl font-black text-white group-hover:text-terminal-green transition-colors">{progressStats.completedTasks}</p>
                </div>
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 text-center group hover:border-terminal-green/30 transition-all cursor-default">
                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-2 tracking-widest">Completion</p>
                  <p className="text-3xl font-black text-white group-hover:text-terminal-green transition-colors">{progressStats.completionRate}%</p>
                </div>
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 text-center group hover:border-terminal-green/30 transition-all cursor-default">
                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-2 tracking-widest">Badges</p>
                  <p className="text-3xl font-black text-white group-hover:text-terminal-green transition-colors">{user.badges?.length || 0}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Decrypted Intel</p>
                {progressLoading && (
                  <div className="text-center py-3 border border-white/10 rounded-xl bg-white/[0.03]">
                    <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Loading progress...</p>
                  </div>
                )}
                <div className="space-y-3 max-h-56 overflow-auto pr-1">
                  {completedChapters.length > 0 ? (
                    completedChapters.slice(0, 10).map((id) => (
                      <div key={String(id)} className="flex items-center gap-3 text-[10px] font-mono text-gray-400 bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-all cursor-default group">
                        <span className="w-1.5 h-1.5 rounded-full bg-terminal-green group-hover:animate-ping"></span>
                        <span className="truncate">CHAPTER {String(id).slice(0, 8).toUpperCase()} COMPLETED</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 border-2 border-dashed border-white/5 rounded-2xl">
                      <p className="text-gray-600 text-[10px] font-mono uppercase tracking-tight">No intelligence gathered</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4 bg-terminal-green/5 border-t border-white/5 text-center">
               <p className="text-[8px] font-mono text-terminal-green/50 uppercase tracking-[0.3em]">System Version 1.1.0 - B-HackMe Profile Module</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default withAuth(ProfilePage);
