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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {BADGE_META.map((badge) => {
        const unlocked = earned.includes(badge.name);
        return (
          <div
            key={badge.name}
            className={`group relative rounded-2xl border p-5 transition-all duration-500 overflow-hidden cursor-help ${
              unlocked
                ? 'border-terminal-green/30 bg-terminal-green/5 ring-1 ring-terminal-green/10'
                : 'border-white/5 bg-white/[0.02] grayscale opacity-40 hover:opacity-60'
            } hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]`}
          >
            {unlocked && (
              <div className="absolute top-0 right-0 p-2">
                 <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
              </div>
            )}
            
            <div className="relative z-10">
              <div className={`text-4xl mb-4 transition-transform duration-500 group-hover:scale-110 drop-shadow-lg ${unlocked ? '' : 'filter blur-[1px]'}`}>
                {badge.icon}
              </div>
              <p className={`text-xs font-black uppercase tracking-widest mb-1 ${unlocked ? 'text-white' : 'text-gray-500'}`}>
                {badge.name}
              </p>
              <p className="text-[9px] text-gray-500 font-mono leading-relaxed line-clamp-2 uppercase">
                {unlocked ? badge.description : 'Locked Record'}
              </p>
            </div>

            {/* Background design element */}
            <div className="absolute -bottom-4 -right-4 w-12 h-12 border border-white/5 rounded-full opacity-10 group-hover:scale-150 transition-transform"></div>
          </div>
        );
      })}
    </div>
  );
}
