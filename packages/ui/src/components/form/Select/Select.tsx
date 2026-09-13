'use client';

import React, { forwardRef } from 'react';

export type SelectStatus = 'default' | 'warn' | 'error';
export type SelectSize = 'sm' | 'md';

export interface OptionItem {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: OptionItem[];
  placeholder?: string;
  status?: SelectStatus;
  isError?: boolean; // 👈 1. isError 타입 추가
  selectSize?: SelectSize;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      placeholder = '선택해주세요',
      status = 'default',
      isError, // 👈 2. ...props에 들어가지 않도록 여기서 먼저 분리!
      selectSize = 'md',
      disabled,
      className = '',
      ...props // 👈 이제 isError가 제거된 순수 HTML select 속성만 남습니다
    },
    ref
  ) => {
    // 👈 3. isError가 true면 status를 'error'로 매핑
    const currentStatus = isError ? 'error' : status;

    return (
      <div
        className={[
          'wds-select-container',
          `size-${selectSize}`,
          `status-${currentStatus}`, // 👈 currentStatus 적용
          disabled ? 'is-disabled' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <select
          ref={ref}
          disabled={disabled}
          className="wds-select-element"
          {...props} // 👈 isError 없이 안전하게 전달됨
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* 드롭다운 Chevron 아이콘 및 아래 <style jsx>는 기존 그대로 유지 */}
        <span className="wds-select-arrow" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>

        {/* ... 기존 style jsx ... */}
      </div>
    );
  }
);

Select.displayName = 'Select';