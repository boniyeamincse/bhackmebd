import { create } from 'zustand';

interface TerminalState {
  connected: boolean;
  lessonId: string | null;
  outputBuffer: string;
  setConnected: (connected: boolean) => void;
  startSession: (lessonId: string) => void;
  appendOutput: (chunk: string) => void;
  clearOutput: () => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
  connected: false,
  lessonId: null,
  outputBuffer: '',
  setConnected: (connected) => set({ connected }),
  startSession: (lessonId) => set({ lessonId, connected: true }),
  appendOutput: (chunk) =>
    set((state) => ({
      outputBuffer: `${state.outputBuffer}${chunk}`.slice(-20000),
    })),
  clearOutput: () => set({ outputBuffer: '' }),
}));
