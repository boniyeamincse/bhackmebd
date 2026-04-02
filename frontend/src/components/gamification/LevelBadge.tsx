const LEVEL_ICONS: Record<string, string> = {
  'Script Kiddie': '🐣',
  'Security Enthusiast': '⚙️',
  'Pentester': '🖥️',
  'Elite Hacker': '🔐',
};

interface Props {
  level: string;
}

export default function LevelBadge({ level }: Props) {
  return (
    <div className="relative group cursor-help" title={level}>
      <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-500" />
      <div className="w-16 h-16 rounded-2xl glass border border-white/10 flex items-center justify-center text-3xl shadow-2xl relative z-10 transition-transform active:scale-95">
        {LEVEL_ICONS[level] ?? '🐣'}
      </div>
    </div>
  );
}
