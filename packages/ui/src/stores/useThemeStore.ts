'use client';
import { create } from 'zustand';
import { theme, AppTheme } from '../tokens';

type ThemeMode = 'light' | 'dark';

export type ResolvedTheme = AppTheme & {
  mode: ThemeMode;
  current: AppTheme['light'];
};

interface ThemeState {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  getTheme: () => ResolvedTheme;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'light',
  toggleTheme: () =>
    set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' })),
  setTheme: (mode) => set({ mode }),
  getTheme: () => {
    const currentMode = get().mode;
    return {
      ...theme,
      mode: currentMode,
      current: currentMode === 'dark' ? theme.dark : theme.light,
    };
  },
}));
