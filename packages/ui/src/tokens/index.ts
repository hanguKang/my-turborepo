import rawTokens from '../tokens/tokens.json';

// 1. 순수 값만 뽑아내는 함수 (작성하신 코드 베이스)
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
    // $extensions, description 등 메타데이터 제외
    if (key.startsWith('$') || key === 'description' || key === 'descripts') continue;
    result[key] = extractValues(val);
  }

  return result;
}

// 2. {Blue.50} 같은 피그마 Alias 참조를 실제 색상/값으로 풀어주는 함수
function resolveAliases(target: any, root: any): any {
  if (typeof target === 'string') {
    // "{Blue.50}" 또는 "{Atomic.Mode 1.Blue.50}" 패턴 매칭
    const match = target.match(/^\{(.+)\}$/);
    if (match) {
      const path = match[1]?.split('.');
      let current: any = root;
      if(!path) return;
      for (const segment of path) {
        current = current?.[segment];
      }
      return typeof current === 'string' ? resolveAliases(current, root) : (current ?? target);
    }
    return target;
  }

  if (target !== null && typeof target === 'object') {
    const resolved: Record<string, any> = Array.isArray(target) ? [] : {};
    for (const [k, v] of Object.entries(target)) {
      resolved[k] = resolveAliases(v, root);
    }
    return resolved;
  }

  return target;
}

// 1단계: 순수 값 추출
const extracted = extractValues(rawTokens);

// 2단계: 참조값 치환 (Atomic Mode 1의 원시 색상 풀과 매핑)
const resolvedTokens = resolveAliases(extracted, {
  ...extracted,
  ...(extracted['Atomic/Mode 1'] || {}), // Blue.50 형태의 단축 경로 대응
});

// 3단계: 쓰기 편하게 최상위 키 정돈
export const theme = {
  atomic: resolvedTokens['Atomic/Mode 1'] || {},
  light: resolvedTokens['Theme/Light'] || {},
  dark: resolvedTokens['Theme/Dark'] || {},
  component: {
    mobile: resolvedTokens['Component/Mobile'] || {},
    desktop: resolvedTokens['Component/Desktop'] || {},
  },
  frame: {
    medium: resolvedTokens['Frame/Medium'] || {},
    small: resolvedTokens['Frame/Small'] || {},
    large: resolvedTokens['Frame/Large'] || {},
    xlarge: resolvedTokens['Frame/Xlarge'] || {},
  },
};

// 테마 전체 타입 자동 생성
export type AppTheme = typeof theme;
