import { useState } from 'react';
import api from '@/lib/api';
import { useTerminalStore } from '@/store/terminal.store';
import MCQTask from './MCQTask';

interface Props {
  task: { 
    id: string; 
    description: string; 
    hint?: string; 
    xp_reward: number;
    validation_type?: string;
    validation_rule?: string;
  };
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
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const isMCQ = task.validation_type === 'mcq';
  const mcqOptions = isMCQ && task.validation_rule ? JSON.parse(task.validation_rule) : [];

  const handleValidate = async () => {
    if (isMCQ && !selectedOption) {
      onToast?.('Please select an option.', 'info');
      return;
    }

    setValidating(true);
    try {
      const payload = isMCQ ? { taskId: task.id, output: selectedOption } : { taskId: task.id, output };
      const { data } = await api.post('/progress/validate', payload);
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
    <div className={`mx-6 mb-4 rounded-xl p-5 border transition-all duration-300 backdrop-blur-sm
      ${isCompleted 
        ? 'bg-green-500/5 border-terminal-green/50 shadow-[0_0_15px_rgba(88,214,141,0.05)]' 
        : 'bg-white/5 border-white/10 shadow-xl'
      }
    `}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500 font-mono">
          {isMCQ ? 'Theoretical Exam' : 'Practical Task'} · {index + 1}
        </span>
        <span className="text-[10px] font-mono text-terminal-green font-bold bg-terminal-green/10 px-2 py-0.5 rounded">
          +{task.xp_reward} XP
        </span>
      </div>
      
      <p className="text-gray-100 text-sm leading-relaxed mb-3">{task.description}</p>
      
      {isMCQ && (
        <MCQTask 
          options={mcqOptions} 
          selectedOption={selectedOption} 
          onSelect={setSelectedOption} 
          isCompleted={isCompleted} 
        />
      )}

      {result && (
        <div className={`mt-3 p-3 rounded-lg text-sm border font-mono ${result.success ? 'bg-green-500/10 border-green-500/20 text-terminal-green' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          <div className="flex items-center gap-2">
            <span className={result.success ? 'text-terminal-green' : 'text-red-400'}>
              {result.success ? '✓' : '✗'}
            </span>
            {result.success ? result.message : `System: ${result.message || 'Incorrect output.'}`}
          </div>
        </div>
      )}
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleValidate}
          disabled={validating || isCompleted}
          className={`flex-1 font-bold text-xs uppercase tracking-widest py-2 rounded-lg transition-all duration-300
            ${isCompleted 
              ? 'bg-terminal-green/20 text-terminal-green cursor-default' 
              : 'bg-terminal-green text-black hover:bg-green-400 active:scale-[0.98] shadow-[0_5px_15px_rgba(88,214,141,0.2)] hover:shadow-[0_8px_20px_rgba(88,214,141,0.3)]'
            }
          `}
        >
          {validating ? 'Verifying Results...' : isCompleted ? 'Completed' : 'Authorize & Validate'}
        </button>
        {task.hint && !isCompleted && (
          <button
            onClick={() => setShowHint((v) => !v)}
            className="px-4 py-2 rounded-lg border border-white/10 text-gray-400 text-[10px] uppercase font-bold tracking-wider hover:bg-white/5 transition-colors"
          >
            {showHint ? 'Hide Hint' : 'Hint'}
          </button>
        )}
      </div>

      {showHint && !isCompleted && task.hint && (
        <div className="mt-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg animate-in fade-in slide-in-from-top-1 duration-300">
          <p className="text-xs text-blue-300 font-mono italic leading-relaxed">
            <span className="font-bold mr-2">HINT:</span>
            {task.hint}
          </p>
        </div>
      )}
    </div>
  );
}
