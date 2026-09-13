'use client';

import React, { forwardRef, useRef, useEffect, useImperativeHandle } from 'react';
import { useTheme } from '@emotion/react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode;
  /** 전체 선택 시 일부만 선택된 상태 표현 */
  indeterminate?: boolean;
  /** 필수 약관 미체크 등 폼 검증 에러 상태 */
  isError?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      checked,
      indeterminate = false,
      isError = false,
      disabled = false,
      className = '',
      onChange,
      ...props
    },
    ref
  ) => {
    const theme = useTheme() as any;
    const colors = theme?.colors || {};

    const inputRef = useRef<HTMLInputElement>(null);

    // forwardRef와 내부 ref 합성
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // 네이티브 input 요소의 indeterminate DOM 프로퍼티 동기화 (필수)
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = Boolean(indeterminate);
      }
    }, [indeterminate]);

    const isChecked = checked && !indeterminate;

    return (
      <label
        className={[
          'wds-checkbox-label',
          disabled ? 'is-disabled' : '',
          isError ? 'has-error' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="wds-checkbox-box">
          <input
            type="checkbox"
            ref={inputRef}
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            className="wds-checkbox-native"
            {...props}
          />
          <span
            className={[
              'wds-checkbox-custom',
              isChecked ? 'is-checked' : '',
              indeterminate ? 'is-indeterminate' : '',
              isError ? 'is-error' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {indeterminate ? (
              <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
                <rect width="10" height="2" rx="1" fill="currentColor" />
              </svg>
            ) : isChecked ? (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path
                  d="M1 4L3.8 7L9 1"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : null}
          </span>
        </span>
        {label && <span className="wds-checkbox-text">{label}</span>}

        <style jsx>{`
          .wds-checkbox-label {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            user-select: none;
            position: relative;
          }

          .wds-checkbox-box {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
          }

          .wds-checkbox-native {
            position: absolute;
            opacity: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            cursor: pointer;
          }

          /* 커스텀 체크박스 박스 */
          .wds-checkbox-custom {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 18px;
            height: 18px;
            border-radius: ${theme?.radii?.sm || 'var(--wds-radius-sm, 4px)'};
            border: 1.5px solid ${colors.border?.default || 'var(--wds-color-border-default, #caced3)'};
            background-color: ${colors.bg?.white || 'var(--wds-color-bg-white, #ffffff)'};
            color: #ffffff;
            transition: all 0.15s ease-in-out;
            box-sizing: border-box;
          }

          /* 1. Hover (선택되지 않았을 때) */
          .wds-checkbox-label:hover:not(.is-disabled) .wds-checkbox-custom:not(.is-checked):not(.is-indeterminate):not(.is-error) {
            border-color: ${colors.primary?.main || 'var(--wds-color-primary, #3366ff)'};
          }

          /* 2. Checked & Indeterminate */
          .wds-checkbox-custom.is-checked,
          .wds-checkbox-custom.is-indeterminate {
            background-color: ${colors.primary?.main || 'var(--wds-color-primary, #3366ff)'};
            border-color: ${colors.primary?.main || 'var(--wds-color-primary, #3366ff)'};
          }

          /* 3. Focus-Visible (키보드 탭 접근성) */
          .wds-checkbox-native:focus-visible + .wds-checkbox-custom {
            outline: 2px solid ${colors.primary?.main || '#3366ff'};
            outline-offset: 2px;
          }

          /* 4. Error 상태 (필수 체크 누락 시) */
          .wds-checkbox-custom.is-error:not(.is-checked):not(.is-indeterminate) {
            border-color: ${colors.status?.danger || 'var(--wds-color-danger, #e53e3e)'};
          }

          /* 5. Disabled 상태 */
          .wds-checkbox-label.is-disabled {
            cursor: not-allowed;
          }
          .wds-checkbox-label.is-disabled .wds-checkbox-custom {
            background-color: ${colors.bg?.disabled || 'var(--wds-color-bg-disabled, #f0f2f5)'};
            border-color: ${colors.border?.subtle || '#e1e4e6'};
            color: ${colors.text?.disabled || '#a4a8ad'};
          }
          .wds-checkbox-label.is-disabled .wds-checkbox-custom.is-checked,
          .wds-checkbox-label.is-disabled .wds-checkbox-custom.is-indeterminate {
            background-color: ${colors.bg?.disabled || '#f0f2f5'};
            border-color: ${colors.border?.subtle || '#e1e4e6'};
          }
          .wds-checkbox-label.is-disabled .wds-checkbox-text {
            color: ${colors.text?.disabled || 'var(--wds-color-text-disabled, #a4a8ad)'};
          }

          /* 텍스트 라벨 */
          .wds-checkbox-text {
            font-size: 14px;
            line-height: 20px;
            color: ${colors.text?.primary || 'var(--wds-color-text-primary, #171717)'};
            transition: color 0.15s ease;
          }
        `}</style>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';