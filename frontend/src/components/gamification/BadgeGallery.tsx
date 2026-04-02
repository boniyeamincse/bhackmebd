const BADGE_META: Array<{ name: string; icon: string; description: string }> = [
  { name: 'First Step', icon: '👣', description: 'Complete your first task.' },
  { name: 'Quick Learner', icon: '⚡', description: 'Complete 10 tasks.' },
  { name: 'Terminal Pro', icon: '💻', description: 'Complete 100 tasks.' },
  { name: 'Hacker', icon: '🛡️', description: 'Reach hacker level.' },
  { name: 'Persistence I', icon: '🔥', description: 'Maintain a 3-day streak.' },
  { name: 'Persistence II', icon: '🔥', description: 'Maintain a 7-day streak.' },
  { name: 'Persistence III', icon: '🔥', description: 'Maintain a 30-day streak.' },
  { name: 'Chapter Starter', icon: '📘', description: 'Complete your first chapter.' },
  { name: 'Chapter Explorer', icon: '📚', description: 'Complete 3 chapters.' },
  { name: 'Chapter Master', icon: '🏁', description: 'Complete 5 chapters.' },
  { name: 'Login Rookie', icon: '🔐', description: 'Log in for 5 total days.' },
  { name: 'Login Veteran', icon: '🗓️', description: 'Log in for 20 total days.' },
  { name: 'XP Grinder I', icon: '⭐', description: 'Earn 500 XP.' },
  { name: 'XP Grinder II', icon: '🌟', description: 'Earn 2000 XP.' },
  { name: 'XP Grinder III', icon: '✨', description: 'Earn 5000 XP.' },
];

interface Props {
  earned: string[];
}

export default function BadgeGallery({ earned }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {BADGE_META.map((badge) => {
        const unlocked = earned.includes(badge.name);
        return (
          <div
            key={badge.name}
            title={badge.description}
            className={`rounded-xl border p-3 transition ${
              unlocked
                ? 'border-terminal-green bg-green-950/20 text-terminal-green'
                : 'border-gray-800 bg-gray-900 text-gray-500'
            }`}
          >
            <div className="text-2xl mb-2">{badge.icon}</div>
            <p className="text-sm font-semibold">{badge.name}</p>
            <p className="text-xs mt-1">{unlocked ? badge.description : 'Locked'}</p>
          </div>
        );
      })}
    </div>
  );
}
