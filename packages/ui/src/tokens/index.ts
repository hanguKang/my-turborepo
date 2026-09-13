import rawTokens from '../tokens/tokens.json';

// 1. 순수 값 추출 함수
function extractValues(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 피그마 토큰 특유의 { value: "...", type: "..." } 형태 처리
  if ('value' in obj) {
    return typeof obj.value === 'object' ? extractValues(obj.value) : obj.value;
  }

  const result: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$') || key === 'description' || key === 'descripts') continue;
    result[key] = extractValues(val);
  }

  return result;
}

// 2. 피그마 Alias 치환 함수 (경로 검색 강화)
function resolveAliases(target: any, rootContext: any): any {
  if (typeof target === 'string') {
    const match = target.match(/^\{(.+)\}$/);
    if (match && match[1]) {
      const fullPath = match[1].trim();
      const segments = fullPath.split('.');

      // 1순위: 루트 컨텍스트에서 검색 (e.g. root["Atomic/Mode 1"]["Cool Neutral"]["10"])
      let current: any = rootContext;
      let found = true;

      for (const seg of segments) {
        if (current && typeof current === 'object' && seg in current) {
          current = current[seg];
        } else {
          found = false;
          break;
        }
      }

      // 2순위: Atomic/Mode 1 내부 단축 경로 검색 (e.g. "Cool Neutral.10" -> Atomic/Mode 1["Cool Neutral"]["10"])
      if (!found && rootContext['Atomic/Mode 1']) {
        current = rootContext['Atomic/Mode 1'];
        found = true;
        for (const seg of segments) {
          if (current && typeof current === 'object' && seg in current) {
            current = current[seg];
          } else {
            found = false;
            break;
          }
        }
      }

      // 3순위: Common 단축 경로 검색 (e.g. "Common.0")
      if (!found && rootContext['Atomic/Mode 1']?.Common) {
        current = rootContext['Atomic/Mode 1'].Common;
        found = true;
        for (const seg of segments) {
          if (current && typeof current === 'object' && seg in current) {
            current = current[seg];
          } else {
            found = false;
            break;
          }
        }
      }

      if (found && current !== undefined && current !== target) {
        return resolveAliases(current, rootContext);
      }
      return target;
    }
    return target;
  }

  if (target !== null && typeof target === 'object') {
    const resolved: Record<string, any> = Array.isArray(target) ? [] : {};
    for (const [k, v] of Object.entries(target)) {
      resolved[k] = resolveAliases(v, rootContext);
    }
    return resolved;
  }

  return target;
}

// 1단계: 순수 값 추출
const extracted = extractValues(rawTokens);

// 2단계: 참조값 치환
const resolvedTokens = resolveAliases(extracted, extracted);

// 3단계: WDS 시맨틱 컬러 구조화
const lightColors = resolvedTokens['Theme/Light'] || {};
const darkColors = resolvedTokens['Theme/Dark'] || {};

// 4단계: 반응형 프레임/컴포넌트 토큰 구조화
const frameTokens = {
  small: resolvedTokens['Frame/Small'] || {},
  medium: resolvedTokens['Frame/Medium'] || {},
  large: resolvedTokens['Frame/Large'] || {},
  xlarge: resolvedTokens['Frame/Xlarge'] || {},
};

const componentTokens = {
  mobile: resolvedTokens['Component/Mobile']?.Value || {},
  desktop: resolvedTokens['Component/Desktop']?.Value || {},
};

// 5단계: 테마 생성기 및 객체 구성
export const createTheme = (mode: 'light' | 'dark' = 'light') => ({
  mode,
  color: mode === 'light' ? lightColors : darkColors,
  atomic: resolvedTokens['Atomic/Mode 1'] || {},
  light: lightColors,
  dark: darkColors,
  frame: frameTokens,
  component: componentTokens,
});

// 기존 코드 호환용 theme 객체 export
export const theme = {
  atomic: resolvedTokens['Atomic/Mode 1'] || {},
  light: lightColors,
  dark: darkColors,
  frame: frameTokens,
  component: componentTokens,
};

export const defaultTheme = createTheme('light');

// 타입 정의
export type AppTheme = typeof theme;