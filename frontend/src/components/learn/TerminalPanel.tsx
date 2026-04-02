import TerminalEmulator from '@/components/terminal/TerminalEmulator';
import TerminalToolbar from '@/components/terminal/TerminalToolbar';

interface Props {
  lessonId: string;
}

export default function TerminalPanel({ lessonId }: Props) {
  return (
    <div className="flex flex-col h-full bg-terminal">
      <div className="bg-gray-900 px-4 py-2 text-xs text-gray-400 font-mono border-b border-gray-800">
        💻 Terminal — hacker@bhackme:~$
      </div>
      <TerminalToolbar />
      <div className="flex-1 overflow-hidden">
        <TerminalEmulator lessonId={lessonId} />
      </div>
    </div>
  );
}
