import '@emotion/react';
import type { AppTheme } from '../tokens';

export type ThemeMode = 'light' | 'dark';

// 사용할 테마의 구조 타입을 정의합니다.
export interface CustomTheme extends AppTheme{
  mode : ThemeMode;
  current : AppTheme['light'];
  colors: {
    primary: string;
    background: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    // 필요에 따라 Atomic 팔레트나 Semantic 토큰들을 매핑합니다.
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  typography: {
    // 폰트 크기, 행간 등
  };
}

declare module '@emotion/react' {
  export interface Theme extends CustomTheme {}
}