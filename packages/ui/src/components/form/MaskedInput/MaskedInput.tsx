'use client';

import React, { forwardRef, useState, useEffect } from 'react';
import { Input, InputProps } from '../Input/Input';

export type MaskType = 'business-no' | 'corporate-no' | 'phone';

export interface MaskedInputProps extends Omit<InputProps, 'onChange' | 'value'> {
  maskType: MaskType;
  value?: string;
  onValueChange?: (formattedValue: string, rawValue: string) => void;
}

function applyMask(val: string, type: MaskType): string {
  const digits = val.replace(/\D/g, '');
  if (type === 'business-no') {
    // 000-00-00000 (사업자번호 10자리)
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 10)}`;
  }
  if (type === 'corporate-no') {
    // 000000-0000000 (법인등록번호 13자리)
    if (digits.length <= 6) return digits;
    return `${digits.slice(0, 6)}-${digits.slice(6, 13)}`;
  }
  if (type === 'phone') {
    // 일반 유선 및 휴대전화
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  }
  return digits;
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ maskType, value = '', onValueChange, ...props }, ref) => {
    const [displayVal, setDisplayVal] = useState(() => applyMask(value, maskType));

    useEffect(() => {
      setDisplayVal(applyMask(value, maskType));
    }, [value, maskType]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '');
      const formatted = applyMask(raw, maskType);
      setDisplayVal(formatted);
      onValueChange?.(formatted, raw);
    };

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        value={displayVal}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

MaskedInput.displayName = 'MaskedInput';