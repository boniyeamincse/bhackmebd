interface Props {
  streakDays: number;
}

export default function StreakCalendar({ streakDays }: Props) {
  const days = Array.from({ length: 7 }, (_, i) => i);
  const active = Math.min(Math.max(streakDays, 0), 7);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">7-Day Streak</p>
      <div className="grid grid-cols-7 gap-2">
        {days.map((i) => {
          const on = i < active;
          return (
            <div
              key={i}
              className={`h-10 rounded-lg grid place-items-center text-xs font-bold ${
                on ? 'bg-terminal-green text-black' : 'bg-gray-800 text-gray-500'
              }`}
            >
              D{i + 1}
            </div>
          );
        })}
      </div>
      <p className="text-sm text-gray-300 mt-3">Current streak: <span className="text-terminal-green font-semibold">{streakDays}</span> day(s)</p>
    </div>
  );
}
