const LEVEL_ICONS: Record<string, string> = {
  beginner: '🐣',
  intermediate: '⚙️',
  advanced: '🖥️',
  hacker: '🔐',
};

interface Props {
  level: string;
}

export default function LevelBadge({ level }: Props) {
  return (
    <span className="text-3xl" title={level}>{LEVEL_ICONS[level] ?? '🐣'}</span>
  );
}
