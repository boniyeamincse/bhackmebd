import { useSocket } from '@/hooks/useSocket';
import { useTerminalStore } from '@/store/terminal.store';

export default function TerminalToolbar() {
  const { socket } = useSocket();
  const { lessonId, outputBuffer, copied, setCopied, clearOutput } = useTerminalStore();

  const handleReset = () => {
    if (!socket || !lessonId) return;
    socket.emit('terminal:disconnect', {});
    clearOutput();
    setTimeout(() => {
      socket.emit('terminal:connect', { lessonId });
    }, 120);
  };

  const handleClear = () => {
    socket?.emit('terminal:input', { data: '\f' });
    clearOutput();
  };

  const handleCopy = async () => {
    if (!outputBuffer) return;
    await navigator.clipboard.writeText(outputBuffer);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-800 text-xs text-gray-400">
      <button className="px-2 py-1 rounded border border-gray-700 hover:bg-gray-800" onClick={handleReset}>Reset</button>
      <button className="px-2 py-1 rounded border border-gray-700 hover:bg-gray-800" onClick={handleClear}>Clear</button>
      <button className="px-2 py-1 rounded border border-gray-700 hover:bg-gray-800" onClick={handleCopy}>Copy</button>
      {copied && <span className="text-terminal-green">Copied</span>}
      <span className="ml-auto font-mono">bash — hacker@bhackme</span>
    </div>
  );
}
