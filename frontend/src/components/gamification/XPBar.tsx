const LEVELS = [
  { min: 0, max: 499, label: 'Beginner', color: 'text-gray-400' },
  { min: 500, max: 1499, label: 'Intermediate', color: 'text-blue-400' },
  { min: 1500, max: 3499, label: 'Advanced', color: 'text-purple-400' },
  { min: 3500, max: Infinity, label: 'Hacker', color: 'text-terminal-green' },
];

interface Props {
  xp: number;
}

export default function XPBar({ xp }: Props) {
  const current = LEVELS.find((l) => xp >= l.min && xp <= l.max) ?? LEVELS[0];
  const next = LEVELS[LEVELS.indexOf(current) + 1];
  const pct = next ? Math.round(((xp - current.min) / (next.min - current.min)) * 100) : 100;

  return (
    <div className="mt-1">
      <p className={`text-xs ${current.color} mb-1`}>{xp} XP · {current.label}</p>
      <div className="h-1.5 bg-gray-800 rounded-full w-48">
        <div className="h-full bg-terminal-green rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
