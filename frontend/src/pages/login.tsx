import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

export default function Login() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth(data.user, data.accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-terminal">
      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-8 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-terminal-green font-mono">Login</h1>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-terminal-green" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-terminal-green" required />
        <button type="submit" className="w-full bg-terminal-green text-black font-bold py-2 rounded-lg hover:bg-green-400 transition">
          Login
        </button>
        <p className="text-gray-500 text-sm text-center">
          No account? <Link href="/register" className="text-terminal-green">Register</Link>
        </p>
      </form>
    </main>
  );
}
