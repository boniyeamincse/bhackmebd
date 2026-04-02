import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import api from '@/lib/api';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    const queryToken = Array.isArray(router.query.token)
      ? router.query.token[0]
      : router.query.token;
    if (typeof queryToken === 'string') setToken(queryToken);
  }, [router.isReady, router.query.token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      setError('Reset token is missing. Open the link from your email.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', { token, password });
      setMessage(data?.message || 'Password reset successful.');
      setTimeout(() => {
        router.push('/login');
      }, 1200);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Could not reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-dark rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Set New Password</h1>
            <p className="text-gray-400">Create a new password for your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-sm">
                {message}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                Reset Token
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white px-5 py-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all placeholder:text-white/20"
                placeholder="Paste reset token"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white px-5 py-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all placeholder:text-white/20"
                placeholder="Minimum 8 characters"
                required
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white px-5 py-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all placeholder:text-white/20"
                placeholder="Repeat password"
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-500 text-black font-bold py-4 rounded-xl hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating Password...' : 'Update Password'}
            </button>

            <div className="pt-6 text-center border-t border-white/5">
              <Link href="/login" className="text-green-500 font-bold hover:text-green-400 transition-colors text-sm">
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </main>
  );
}
