import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#05070a] overflow-hidden relative">
      {/* Background Glow Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 blur-[120px] rounded-full animate-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full animate-glow" style={{ animationDelay: '1s' }} />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center font-bold text-black text-xs font-mono">BH</div>
          <span className="font-bold text-xl tracking-tight font-mono text-white">B-HackMe</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
          <Link href="#features" className="hover:text-green-400 transition-colors">Features</Link>
          <Link href="#roadmap" className="hover:text-green-400 transition-colors">Roadmap</Link>
          <Link href="https://github.com/boniyeamincse/bhackmebd" className="hover:text-green-400 transition-colors">GitHub</Link>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-4 py-2">Login</Link>
          <Link href="/register" className="text-sm font-bold bg-green-500 text-black px-5 py-2 rounded-md hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold font-mono mb-6 tracking-wider uppercase">
            Built for Bangladesh 🇧🇩
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            Learn Linux. <span className="text-green-500">Think Like a Hacker.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Master command line skills and cybersecurity in a safe, interactive environment powered by Docker. 
            Level up your career with the ultimate interactive playground.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/register" className="bg-green-500 text-black text-lg font-bold px-8 py-4 rounded-xl hover:bg-green-400 transition-all shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              Start Learning Now
            </Link>
            <Link href="#demo" className="glass text-white text-lg font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all">
              View Demo
            </Link>
          </div>
        </motion.div>

        {/* Terminal Preview */}
        <motion.div 
          id="demo"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full max-w-5xl glass-dark rounded-2xl p-1 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
        >
          <div className="bg-[#0c0e12] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">interactive-shell: bhackme-lab</div>
              <div className="w-10" />
            </div>
            <div className="p-6 font-mono text-sm sm:text-base leading-relaxed text-green-400/90 h-[400px] overflow-hidden flex flex-col justify-start text-left">
              <div className="flex gap-3 mb-2">
                <span className="text-white/50">$</span>
                <span>bhackme-cli login --user=hacker</span>
              </div>
              <div className="mb-4 text-white/40">[*] Handshake with remote bridge successful...</div>
              <div className="mb-4 text-white/40">[*] Spawning isolated container: <span className="text-blue-400">node-12-hardened-alpine</span></div>
              <div className="flex gap-3 mb-2">
                <span className="text-green-500">hacker@bhackme:~$</span>
                <span className="text-white animate-pulse">_</span>
              </div>
              <div className="mt-auto pt-4 border-t border-white/5 flex gap-8">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-white/30 tracking-widest">Current Rank</span>
                  <span className="text-white font-bold">Script Kiddie</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-white/30 tracking-widest">XP Progress</span>
                  <span className="text-green-500 font-bold">2,450 / 5,000</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Isolated Labs",
              desc: "Get your own private Docker container for every lesson. Break everything, reset anytime.",
              icon: "🛡️"
            },
            {
              title: "Gamified XP",
              desc: "Earn XP, unlock rare badges, and climb the national leaderboard while you learn.",
              icon: "🏆"
            },
            {
              title: "Bengali Lessons",
              desc: "High-quality cybersecurity content explained in Bengali and English for better understanding.",
              icon: "🇧🇩"
            }
          ].map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl glass hover:border-green-500/30 transition-all group"
            >
              <div className="text-4xl mb-6">{f.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">{f.title}</h3>
              <p className="text-gray-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>&copy; 2026 B-HackMe. Learn Linux. Think Like a Hacker. Built for Bangladesh. 🇧🇩</p>
      </footer>
    </main>
  );
}
