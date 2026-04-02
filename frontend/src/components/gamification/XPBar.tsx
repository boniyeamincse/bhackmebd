const LEVELS: any[] = [
  { min: 0, max: 499, label: 'Script Kiddie', color: 'text-gray-400', bg: 'bg-gray-400' },
  { min: 500, max: 1499, label: 'Security Enthusiast', color: 'text-blue-400', bg: 'bg-blue-400' },
  { min: 1500, max: 3499, label: 'Pentester', color: 'text-purple-400', bg: 'bg-purple-400' },
  { min: 3500, max: Infinity, label: 'Elite Hacker', color: 'text-green-500', bg: 'bg-green-500' },
];

interface Props {
  xp: number;
}

export default function XPBar({ xp }: Props) {
  const current = LEVELS.find((l) => xp >= l.min && xp <= l.max) ?? LEVELS[0];
  const next = LEVELS[LEVELS.indexOf(current) + 1];
  const pct = next ? Math.round(((xp - current.min) / (next.min - current.min)) * 100) : 100;
  const xpToNext = next ? Math.max(next.min - xp, 0) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-0.5">Experience Level</span>
          <span className={`text-sm font-bold ${current.color} font-mono uppercase tracking-tight`}>{current.label}</span>
        </div>
        <span className="text-xs font-mono text-gray-400">
          <span className="text-white font-bold">{xp.toLocaleString()}</span> / {next ? next.min.toLocaleString() : 'MAX'} XP
        </span>
      </div>
      
      <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
        <div 
          className={`absolute top-0 left-0 h-full ${current.bg} transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(34,197,94,0.3)]`} 
          style={{ width: `${pct}%` }} 
        />
      </div>
      
      {next && (
        <div className="mt-2 flex justify-between items-center">
          <span className="text-[10px] text-gray-500 font-medium">Progress to {next.label}</span>
          <span className="text-[10px] text-gray-400 font-mono font-bold tracking-wider">{pct}%</span>
        </div>
      )}
    </div>
  );
}
