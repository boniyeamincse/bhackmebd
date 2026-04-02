import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

export default function Login() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth(data.user, data.accessToken, data.refreshToken || null);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-dark rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center font-bold text-black text-xl font-mono mx-auto">BH</div>
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Authenticate to gain access.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white px-5 py-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all placeholder:text-white/20"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                  Security Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white px-5 py-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all placeholder:text-white/20"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-500 text-black font-bold py-4 rounded-xl hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? 'Authenticating...' : 'Authorize Access'}
            </button>

            <div className="pt-6 text-center border-t border-white/5">
              <p className="text-gray-500 text-sm">
                New identity needed?{' '}
                <Link href="/register" className="text-green-500 font-bold hover:text-green-400 transition-colors">
                  Create identification
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </main>
  );
}
