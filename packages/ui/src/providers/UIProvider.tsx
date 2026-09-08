// import React, { createContext, useContext, useMemo, useState } from 'react';
// import { ThemeProvider as EmotionThemeProvider, Global, css } from '@emotion/react';
// import { theme, AppTheme } from '../tokens';
// import type { ThemeMode } from '../styles/emotion.d';

// // Emotion ThemeProvider에 주입될 실제 테마 객체 타입
// export type ResolvedTheme = AppTheme & {
//   mode: ThemeMode;
//   current: AppTheme['light']; // 현재 활성화된 라이트 또는 다크 모드 토큰
// };

// interface ThemeContextValue {
//   mode: ThemeMode;
//   toggleTheme: () => void;
//   setTheme: (mode: ThemeMode) => void;
//   theme: ResolvedTheme;
// }

// const ThemeContext = createContext<ThemeContextValue | null>(null);

// export const useUITheme = () => {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error('useUITheme must be used within a UIProvider');
//   }
//   return context;
// };

// interface UIProviderProps {
//   children: React.ReactNode;
//   initialMode?: ThemeMode;
// }

// export const UIProvider: React.FC<UIProviderProps> = ({
//   children,
//   initialMode = 'light',
// }) => {
//   const [mode, setMode] = useState<ThemeMode>(initialMode);

//   const toggleTheme = () => {
//     setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
//   };

//   // mode에 따라 현재 활성화된 테마 객체 조합
//   const currentTheme: ResolvedTheme = useMemo(() => {
//     const activeModeTokens = mode === 'dark' ? theme.dark : theme.light;
//     return {
//       ...theme,
//       mode,
//       current: activeModeTokens,
//     };
//   }, [mode]);

//   // 배경 및 텍스트 기본 글로벌 스타일 리셋
//   // 토큰 키 구조에 맞게 안전하게 fallback 지정
//   const bgColor = mode === 'dark' ? '#0F172A' : '#FFFFFF';
//   const textColor = mode === 'dark' ? '#F8FAFC' : '#0F172A';

//   const globalStyles = css`
//     body {
//       background-color: ${bgColor};
//       color: ${textColor};
//       transition: background-color 0.2s ease, color 0.2s ease;
//       margin: 0;
//       font-family: -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif;
//     }
//   `;

//   return (
//     <ThemeContext.Provider value={{ mode, toggleTheme, setTheme: setMode, theme: currentTheme }}>
//       <EmotionThemeProvider theme={currentTheme}>
//         <Global styles={globalStyles} />
//         {children}
//       </EmotionThemeProvider>
//     </ThemeContext.Provider>
//   );
// };
'use client';

import React from 'react';
import { ThemeProvider as EmotionThemeProvider, Global, css } from '@emotion/react';
import { useThemeStore } from '../stores/useThemeStore';

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Zustand 스토어에서 상태와 계산 함수 구독
  const mode = useThemeStore((state) => state.mode);
  const currentTheme = useThemeStore((state) => state.getTheme)();

  const bgColor = mode === 'dark' ? '#0F172A' : '#FFFFFF';
  const textColor = mode === 'dark' ? '#F8FAFC' : '#0F172A';

  const globalStyles = css`
    body {
      background-color: ${bgColor};
      color: ${textColor};
      transition: background-color 0.2s ease, color 0.2s ease;
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif;
    }
  `;

  return (
    <EmotionThemeProvider theme={currentTheme}>
      <Global styles={globalStyles} />
      {children}
    </EmotionThemeProvider>
  );
};