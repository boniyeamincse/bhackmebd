import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-terminal px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-4xl"
      >
        <h1 className="text-5xl font-bold text-terminal-green mb-4 font-mono">B-HackMe</h1>
        <p className="text-gray-400 text-xl mb-8">Bangladesh Hack &amp; Learn Platform</p>
        <p className="text-gray-500 mb-10 max-w-xl mx-auto">
          Learn Linux &amp; Cybersecurity through hands-on terminal challenges in isolated Docker environments.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register" className="bg-terminal-green text-black font-bold px-6 py-3 rounded-lg hover:bg-green-400 transition">
            Get Started
          </Link>
          <Link href="/login" className="border border-terminal-green text-terminal-green px-6 py-3 rounded-lg hover:bg-green-900 transition">
            Login
          </Link>
        </div>

        <div className="mt-12 rounded-xl border border-gray-800 bg-black/40 text-left overflow-hidden shadow-2xl shadow-black/40">
          <div className="px-4 py-2 bg-gray-900 border-b border-gray-800 text-xs text-gray-400 font-mono">
            demo-terminal.png
          </div>
          <div className="p-4 font-mono text-sm leading-6 text-terminal-green">
            <p>$ whoami</p>
            <p>hacker</p>
            <p>$ ls /etc | grep pass</p>
            <p>passwd</p>
            <p>$ echo &quot;Task complete: +25 XP&quot;</p>
            <p>Task complete: +25 XP</p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
