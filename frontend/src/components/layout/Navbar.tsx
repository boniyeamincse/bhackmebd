import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/router';

export default function Navbar() {
  const { user, token, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
      <Link href="/" className="text-terminal-green font-bold text-xl font-mono">B-HackMe</Link>
      <div className="flex items-center gap-4">
        {token ? (
          <>
            <Link href="/dashboard" className="text-gray-300 hover:text-white text-sm">Dashboard</Link>
            <Link href="/chapters" className="text-gray-300 hover:text-white text-sm">Chapters</Link>
            <span className="text-xs bg-gray-800 text-terminal-green px-2 py-1 rounded font-mono">
              XP {user?.total_xp ?? 0}
            </span>
            <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded capitalize">
              {user?.level ?? 'beginner'}
            </span>
            <span className="text-gray-500 text-sm">{user?.username}</span>
            <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-sm">Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-gray-300 hover:text-white text-sm">Login</Link>
            <Link href="/register" className="bg-terminal-green text-black text-sm font-bold px-4 py-1 rounded hover:bg-green-400">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
