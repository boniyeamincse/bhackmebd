import { useSocket } from '@/hooks/useSocket';

export default function TerminalToolbar() {
  const { socket } = useSocket();

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-800 text-xs text-gray-400">
      <span className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" onClick={() => socket?.emit('terminal:disconnect', {})} title="Close" />
      <span className="w-3 h-3 rounded-full bg-yellow-500" />
      <span className="w-3 h-3 rounded-full bg-terminal-green" />
      <span className="ml-auto font-mono">bash — hacker@bhackme</span>
    </div>
  );
}
