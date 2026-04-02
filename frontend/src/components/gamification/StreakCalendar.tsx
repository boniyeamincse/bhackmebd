import { motion } from 'framer-motion';

interface Props {
  streakDays: number;
}

export default function StreakCalendar({ streakDays }: Props) {
  const days = Array.from({ length: 7 }, (_, i) => i);
  const active = Math.min(Math.max(streakDays, 0), 7);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Training Activity</span>
        <span className="text-xs font-mono font-bold text-green-500 flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          {streakDays} DAY STREAK
        </span>
      </div>
      
      <div className="grid grid-cols-7 gap-3">
        {days.map((i) => {
          const on = i < active;
          return (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.1 }}
              className={`aspect-square rounded-md flex flex-col items-center justify-center border transition-all ${
                on 
                ? 'bg-green-500 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)] shadow-inner' 
                : 'bg-white/5 border-white/5 hover:border-white/10'
              }`}
            >
              <span className={`text-[10px] font-bold ${on ? 'text-black' : 'text-gray-600'}`}>D{i + 1}</span>
              {on && <div className="w-1 h-1 bg-black/40 rounded-full mt-0.5" />}
            </motion.div>
          );
        })}
      </div>
      
      <p className="text-[11px] text-gray-500 mt-6 leading-relaxed">
        Maintaining your streak increases your XP multiplier. Keep training daily to reach <span className="text-white">Elite Hacker</span> status.
      </p>
    </div>
  );
}
