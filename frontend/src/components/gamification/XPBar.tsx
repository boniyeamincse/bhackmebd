const LEVELS: any[] = [
  { min: 0, max: 499, label: 'Script Kiddie', color: 'text-gray-400', bg: 'bg-gray-400' },
  { min: 500, max: 1499, label: 'Security Enthusiast', color: 'text-blue-400', bg: 'bg-blue-400' },
  { min: 1500, max: 3499, label: 'Pentester', color: 'text-purple-400', bg: 'bg-purple-400' },
  { min: 3500, max: Infinity, label: 'Elite Hacker', color: 'text-green-500', bg: 'bg-green-500' },
];

interface Props {
  xp: number;
}

export default function XPBar({ xp = 0 }: Props) {
  const current = LEVELS.find((l) => xp >= l.min && xp <= l.max) ?? LEVELS[0];
  const next = LEVELS[LEVELS.indexOf(current) + 1];
  const safeXp = xp ?? 0;
  const pct = next ? Math.round(((safeXp - current.min) / (next.min - current.min)) * 100) : 100;
  const xpToNext = next ? Math.max(next.min - safeXp, 0) : 0;

  return (
    <div className="w-full group">
      <div className="flex justify-between items-end mb-3">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-gray-500 font-black tracking-[0.2em] mb-1">Combat Rating</span>
          <span className={`text-sm font-black ${current.color} font-mono uppercase tracking-tight group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all`}>{current.label}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase text-gray-500 font-black tracking-[0.2em] block mb-1">XP Points</span>
          <span className="text-xs font-mono font-bold text-white tracking-widest bg-white/10 px-2 py-0.5 rounded-lg border border-white/5 shadow-inner">
            {safeXp.toLocaleString()} <span className="text-gray-500 mx-1">/</span> {next ? next.min.toLocaleString() : 'MAX'}
          </span>
        </div>
      </div>
      
      <div className="relative h-4 w-full bg-white/[0.03] rounded-2xl overflow-hidden border border-white/5 p-[3px]">
        <div 
          className={`h-full rounded-xl ${current.bg} transition-all duration-1000 ease-[cubic-bezier(0.2,0,0,1)] relative`} 
          style={{ width: `${pct}%` }} 
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
          <div className="absolute top-0 right-0 h-full w-4 bg-white/40 blur-[4px] rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {next && (
        <div className="mt-3 flex justify-between items-center px-1">
          <span className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">Next Rank: {next.label}</span>
          <span className="text-[9px] text-terminal-green/80 font-black font-mono tracking-widest">{pct}% SYNCED</span>
        </div>
      )}
    </div>
  );
}
