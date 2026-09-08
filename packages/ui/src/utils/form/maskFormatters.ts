export type MaskType = 'business' | 'phone' | 'resident';

export const formatByMask = (val: string, type: MaskType): { formatted: string; raw: string } => {
  const digits = val.replace(/\D/g, ''); // 숫자만 추출

  switch (type) {
    case 'business': {
      // 3-2-5 (총 10자리)
      const raw = digits.slice(0, 10);
      if (raw.length <= 3) return { formatted: raw, raw };
      if (raw.length <= 5) return { formatted: `${raw.slice(0, 3)}-${raw.slice(3)}`, raw };
      return { formatted: `${raw.slice(0, 3)}-${raw.slice(3, 5)}-${raw.slice(5)}`, raw };
    }
    case 'phone': {
      // 010-XXXX-XXXX (총 11자리 기준)
      const raw = digits.slice(0, 11);
      if (raw.length <= 3) return { formatted: raw, raw };
      if (raw.length <= 7) return { formatted: `${raw.slice(0, 3)}-${raw.slice(3)}`, raw };
      return { formatted: `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7)}`, raw };
    }
    case 'resident': {
      // 6자리 생년월일 - 뒤 1자리(성별) 형태 (총 7자리 기준)
      const raw = digits.slice(0, 7);
      if (raw.length <= 6) return { formatted: raw, raw };
      return { formatted: `${raw.slice(0, 6)}-${raw.slice(6)}`, raw };
    }
    default:
      return { formatted: digits, raw: digits };
  }
};
