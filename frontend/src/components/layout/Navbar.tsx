import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, token, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center font-bold text-black text-xs font-mono group-hover:scale-110 transition-transform">BH</div>
          <span className="font-bold text-xl tracking-tight font-mono text-white group-hover:text-green-400 transition-colors">B-HackMe</span>
        </Link>
        
        {token && (
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-400">
            <Link href="/dashboard" className={`hover:text-green-400 transition-colors ${router.pathname === '/dashboard' ? 'text-green-500' : ''}`}>Dashboard</Link>
            <Link href="/chapters" className={`hover:text-green-400 transition-colors ${router.pathname.startsWith('/chapters') ? 'text-green-500' : ''}`}>Labs</Link>
            <Link href="/leaderboard" className={`hover:text-green-400 transition-colors ${router.pathname === '/leaderboard' ? 'text-green-500' : ''}`}>Leaderboard</Link>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        {token ? (
          <>
            <div className="hidden sm:flex items-center gap-3 glass px-3 py-1.5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none pt-0.5">
                {user?.level}
              </span>
              <div className="w-px h-3 bg-white/10" />
              <span className="text-xs font-bold text-green-500 font-mono">
                {user?.total_xp} XP
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-xs font-bold text-white leading-tight">{user?.username}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Authorized User</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="text-sm font-bold bg-green-500 text-black px-5 py-2 rounded-md hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]">Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
