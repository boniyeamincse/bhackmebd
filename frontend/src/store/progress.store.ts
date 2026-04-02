import { create } from 'zustand';

interface ProgressState {
  completedTasks: Set<string>;
  markCompleted: (taskId: string) => void;
  isCompleted: (taskId: string) => boolean;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  completedTasks: new Set(),
  markCompleted: (taskId) =>
    set((state) => ({ completedTasks: new Set([...state.completedTasks, taskId]) })),
  isCompleted: (taskId) => get().completedTasks.has(taskId),
}));
