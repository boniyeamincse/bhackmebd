import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [devResetUrl, setDevResetUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setDevResetUrl('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMessage(data?.message || 'If an account exists, a reset link was generated.');
      if (data?.resetUrl) {
        setDevResetUrl(data.resetUrl);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Could not process request.');
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
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-gray-400">Enter your account email to generate a reset link.</p>
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

            {devResetUrl && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 px-4 py-3 rounded-xl text-sm break-all">
                Dev reset link: <Link className="underline" href={devResetUrl}>{devResetUrl}</Link>
              </div>
            )}

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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-500 text-black font-bold py-4 rounded-xl hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating Link...' : 'Generate Reset Link'}
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
