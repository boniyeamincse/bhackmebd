import { useEffect, useState } from 'react';

interface Props {
  level: string;
  open: boolean;
  onClose: () => void;
}

export default function LevelUpOverlay({ level, open, onClose }: Props) {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    setVisible(open);
    if (!open) return;
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <div className="relative bg-gray-900 border border-terminal-green rounded-2xl p-8 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-70">
          {Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              className="absolute w-2 h-2 rounded-full bg-terminal-green animate-ping"
              style={{ left: `${(i * 13) % 100}%`, top: `${(i * 7) % 100}%`, animationDelay: `${(i % 8) * 120}ms` }}
            />
          ))}
        </div>
        <p className="text-3xl font-bold text-terminal-green relative">LEVEL UP!</p>
        <p className="text-gray-300 mt-2 relative">You reached <span className="capitalize">{level}</span></p>
      </div>
    </div>
  );
}
