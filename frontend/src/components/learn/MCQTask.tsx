import { useState } from 'react';

interface Props {
  options: string[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
  isCompleted?: boolean;
}

export default function MCQTask({ options, selectedOption, onSelect, isCompleted }: Props) {
  return (
    <div className="space-y-3 mt-4">
      {options.map((option, idx) => {
        const isSelected = selectedOption === String(idx);
        return (
          <button
            key={idx}
            disabled={isCompleted}
            onClick={() => onSelect(String(idx))}
            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 text-sm font-mono
              ${
                isSelected
                  ? 'bg-terminal-green/20 border-terminal-green text-white shadow-[0_0_10px_rgba(88,214,141,0.2)]'
                  : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-500 hover:bg-gray-800'
              }
              ${isCompleted && isSelected ? 'opacity-100' : isCompleted ? 'opacity-50 grayscale' : ''}
            `}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                ${isSelected ? 'border-terminal-green' : 'border-gray-600'}
              `}
              >
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-terminal-green" />}
              </div>
              <span>{option}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
