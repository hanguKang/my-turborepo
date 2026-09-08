'use client';

import { useState, useCallback, useEffect } from 'react';
import { formatByMask, MaskType } from '../../utils/form/maskFormatters';

interface UseMaskProps {
  initialValue?: string;
  type: MaskType;
  onChange?: (val: { formatted: string; raw: string }) => void;
}

export function useMask({ initialValue = '', type, onChange }: UseMaskProps) {
  const [displayValue, setDisplayValue] = useState(() => formatByMask(initialValue, type).formatted);

  useEffect(() => {
    setDisplayValue(formatByMask(initialValue, type).formatted);
  }, [initialValue, type]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    const { formatted, raw } = formatByMask(inputVal, type);

    setDisplayValue(formatted);
    onChange?.({ formatted, raw });
  }, [type, onChange]);

  return {
    value: displayValue,
    onChange: handleChange,
  };
}