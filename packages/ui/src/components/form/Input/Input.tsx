'use client';

import React, { forwardRef, useState, useEffect } from 'react';
import { useTheme } from '@emotion/react';

export type InputStatus = 'default' | 'warn' | 'error';
export type InputSize = 'sm' | 'md'; // 기업여신 고밀도(sm: 32px), 일반(md: 40px)

// Input.tsx

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  status?: InputStatus;
  isError?: boolean; // 👈 1. 타입 추가
  inputSize?: InputSize;
  suffix?: React.ReactNode;
  isFilled?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      status = 'default',
      isError, // 👈 2. ...props에 포함되지 않도록 여기서 명시적으로 꺼냄
      inputSize = 'md',
      suffix,
      disabled,
      readOnly,
      value,
      defaultValue,
      onChange,
      isFilled: forcedIsFilled,
      className = '',
      ...props // 👈 이제 isError가 제거된 순수 HTML input props만 남음
    },
    ref
  ) => {
    // 👈 3. isError가 true이면 status를 자동으로 'error'로 매핑
    const currentStatus = isError ? 'error' : status;

    const theme = useTheme() as any;
    const colors = theme?.colors || {};

    const [innerValue, setInnerValue] = useState<string | number | readonly string[]>(
      value ?? defaultValue ?? ''
    );

    useEffect(() => {
      if (value !== undefined) {
        setInnerValue(value);
      }
    }, [value]);

    const isFilled =
      forcedIsFilled !== undefined
        ? forcedIsFilled
        : innerValue !== '' && innerValue !== undefined && innerValue !== null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setInnerValue(e.target.value);
      }
      onChange?.(e);
    };

    return (
      <div
        className={[
          'wds-input-container',
          `size-${inputSize}`,
          `status-${currentStatus}`, // 👈 currentStatus 반영
          disabled ? 'is-disabled' : '',
          readOnly ? 'is-readonly' : '',
          isFilled ? 'is-filled' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <input
          ref={ref}
          disabled={disabled}
          readOnly={readOnly}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          className="wds-input-element"
          {...props} // 👈 isError가 빠져서 안전하게 전달됨
        />
        {suffix && <span className="wds-input-suffix">{suffix}</span>}

        {/* 기존 <style jsx> 그대로 유지 */}
      </div>
    );
  }
);