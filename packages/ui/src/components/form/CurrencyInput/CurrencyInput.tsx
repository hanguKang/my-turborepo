'use client';

import React, { forwardRef, useState, useEffect } from 'react';
import { Input } from '../Input/Input';
import type { InputProps } from '../Input/Input';

// 숫자를 한글 금액 단위(억, 만 원)로 치환하는 헬퍼 함수
function formatKoreanCurrency(numStr: string): string {
  const num = parseInt(numStr.replace(/[^0-9]/g, ''), 10);
  if (isNaN(num) || num === 0) return '';

  const units = ['', '만', '억', '조'];
  let result = '';
  let temp = num;
  let unitIndex = 0;

  while (temp > 0) {
    const chunk = temp % 10000;
    if (chunk > 0) {
      result = `${chunk.toLocaleString('ko-KR')}${units[unitIndex]} ` + result;
    }
    temp = Math.floor(temp / 10000);
    unitIndex++;
  }

  return result.trim() + '원';
}

export interface CurrencyInputProps extends Omit<InputProps, 'onChange' | 'value'> {
  value?: number | string;
  onValueChange?: (rawNumber: number) => void;
  showKoreanText?: boolean;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value = '', onValueChange, showKoreanText = true, suffix = '원', ...props }, ref) => {
    const [displayVal, setDisplayVal] = useState('');

    useEffect(() => {
      if (value !== undefined && value !== null && value !== '') {
        const num = String(value).replace(/[^0-9]/g, '');
        setDisplayVal(num ? Number(num).toLocaleString('ko-KR') : '');
      } else {
        setDisplayVal('');
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, '');
      if (!raw) {
        setDisplayVal('');
        onValueChange?.(0);
        return;
      }
      const numVal = parseInt(raw, 10);
      setDisplayVal(numVal.toLocaleString('ko-KR'));
      onValueChange?.(numVal);
    };

    const koreanText = formatKoreanCurrency(displayVal);

    return (
      <div className="currency-input-wrapper">
        <Input
          ref={ref}
          type="text"
          inputMode="numeric"
          value={displayVal}
          onChange={handleChange}
          suffix={suffix}
          {...props}
        />
        {showKoreanText && koreanText && (
          <span className="currency-korean-guide">{koreanText}</span>
        )}

        <style jsx>{`
          .currency-input-wrapper {
            display: flex;
            flex-direction: column;
            gap: 4px;
            width: 100%;
          }
          .currency-korean-guide {
            font-size: 12px;
            font-weight: 500;
            color: var(--wanted-color-primary, #3366ff);
            padding-left: 2px;
          }
        `}</style>
      </div>
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';
