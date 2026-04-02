import { useState } from 'react';
import { useSocket } from '@/hooks/useSocket';

interface Props {
  task: { id: string; description: string; hint?: string; xp_reward: number };
  index: number;
}

export default function TaskCard({ task, index }: Props) {
  const { socket } = useSocket();
  const [result, setResult] = useState<{ success: boolean; message?: string; hint?: string } | null>(null);

  const handleValidate = () => {
    socket?.emit('task:validate', { taskId: task.id, output: '' });
    socket?.once('task:result', (data) => setResult(data));
  };

  return (
    <div className="mx-6 mb-4 bg-gray-900 rounded-lg p-4 border border-gray-800">
      <p className="text-xs text-gray-500 mb-1 font-mono">Task {index + 1} · +{task.xp_reward} XP</p>
      <p className="text-white text-sm">{task.description}</p>
      {result && (
        <p className={`mt-2 text-sm ${result.success ? 'text-terminal-green' : 'text-red-400'}`}>
          {result.success ? result.message : `Incorrect. ${result.hint || ''}`}
        </p>
      )}
      <div className="flex gap-2 mt-3">
        <button onClick={handleValidate} className="bg-terminal-green text-black text-xs font-bold px-3 py-1 rounded hover:bg-green-400">
          ✅ Validate
        </button>
        {task.hint && (
          <button onClick={() => setResult({ success: false, hint: task.hint })}
            className="border border-gray-600 text-gray-300 text-xs px-3 py-1 rounded hover:bg-gray-800">
            💡 Hint
          </button>
        )}
      </div>
    </div>
  );
}
