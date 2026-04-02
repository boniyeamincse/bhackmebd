interface Props {
  badges: string[];
}

export default function BadgeDisplay({ badges }: Props) {
  if (!badges?.length) return <p className="text-gray-600 text-sm">No badges yet.</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <span key={badge} className="bg-gray-800 text-terminal-green text-xs px-3 py-1 rounded-full font-mono border border-terminal-green">
          {badge}
        </span>
      ))}
    </div>
  );
}
