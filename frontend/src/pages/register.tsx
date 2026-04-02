import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '@/lib/api';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', form);
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-terminal">
      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-8 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-terminal-green font-mono">Create Account</h1>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {(['username', 'email', 'password'] as const).map((field) => (
          <input key={field} type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-terminal-green"
            required />
        ))}
        <button type="submit" className="w-full bg-terminal-green text-black font-bold py-2 rounded-lg hover:bg-green-400 transition">
          Register
        </button>
        <p className="text-gray-500 text-sm text-center">
          Have an account? <Link href="/login" className="text-terminal-green">Login</Link>
        </p>
      </form>
    </main>
  );
}
