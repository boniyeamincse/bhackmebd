import { useState } from 'react';
import api from '@/lib/api';
import { useTerminalStore } from '@/store/terminal.store';

interface Props {
  task: { id: string; description: string; hint?: string; xp_reward: number };
  index: number;
  isCompleted?: boolean;
  onComplete?: (taskId: string, index: number, badges?: string[]) => void;
  onToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

type ValidateResult = {
  success: boolean;
  message?: string;
  hint?: string;
  attempts?: number;
  xp?: number;
  badges?: string[];
};

export default function TaskCard({ task, index, isCompleted, onComplete, onToast }: Props) {
  const output = useTerminalStore((s) => s.outputBuffer);
  const [result, setResult] = useState<ValidateResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [validating, setValidating] = useState(false);

  const handleValidate = async () => {
    setValidating(true);
    try {
      const { data } = await api.post('/progress/validate', { taskId: task.id, output });
      setResult(data);

      if (data.success) {
        onToast?.(data.message || `Correct! +${task.xp_reward} XP`, 'success');
        onComplete?.(task.id, index, data.badges || []);
      } else {
        onToast?.('Validation failed. Try again or open hint.', 'error');
      }
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Validation failed';
      setResult({ success: false, message });
      onToast?.(message, 'error');
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className={`mx-6 mb-4 rounded-lg p-4 border ${isCompleted ? 'bg-green-950/20 border-terminal-green' : 'bg-gray-900 border-gray-800'}`}>
      <p className="text-xs text-gray-500 mb-1 font-mono">Task {index + 1} · +{task.xp_reward} XP</p>
      <p className="text-white text-sm">{task.description}</p>
      {result && (
        <p className={`mt-2 text-sm ${result.success ? 'text-terminal-green' : 'text-red-400'}`}>
          {result.success ? result.message : `Incorrect. ${result.message || ''}`}
        </p>
      )}
      {typeof result?.attempts === 'number' && !result.success && (
        <p className="text-xs text-yellow-400 mt-1">Attempts: {result.attempts}</p>
      )}
      {showHint && task.hint && <p className="text-xs text-blue-300 mt-2">Hint: {task.hint}</p>}
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleValidate}
          disabled={validating}
          className="bg-terminal-green text-black text-xs font-bold px-3 py-1 rounded hover:bg-green-400 disabled:opacity-60"
        >
          {validating ? 'Checking...' : 'Validate'}
        </button>
        {task.hint && (
          <button
            onClick={() => setShowHint((v) => !v)}
            className="border border-gray-600 text-gray-300 text-xs px-3 py-1 rounded hover:bg-gray-800">
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
        )}
      </div>
    </div>
  );
}
