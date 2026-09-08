'use client';

import React, { forwardRef } from 'react';

export type InputStatus = 'default' | 'warn' | 'error';
export type InputSize = 'sm' | 'md'; // 기업여신 고밀도(sm: 32px), 일반(md: 40px)

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  status?: InputStatus;
  inputSize?: InputSize;
  suffix?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ status = 'default', inputSize = 'md', suffix, disabled, readOnly, className = '', ...props }, ref) => {
    return (
      <div
        className={[
          'wds-input-container',
          `size-${inputSize}`,
          `status-${status}`,
          disabled ? 'is-disabled' : '',
          readOnly ? 'is-readonly' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <input
          ref={ref}
          disabled={disabled}
          readOnly={readOnly}
          className="wds-input-element"
          {...props}
        />
        {suffix && <span className="wds-input-suffix">{suffix}</span>}

        <style jsx>{`
          .wds-input-container {
            display: flex;
            align-items: center;
            width: 100%;
            border-radius: var(--wanted-radius-md, 6px);
            border: 1px solid var(--wanted-color-border-default, #e1e4e6);
            background-color: var(--wanted-color-bg-white, #ffffff);
            transition: all 0.15s ease-in-out;
            box-sizing: border-box;
          }

          /* 고밀도 사이즈 대응 */
          .wds-input-container.size-sm {
            height: 32px;
            padding: 0 10px;
            font-size: 13px;
          }
          .wds-input-container.size-md {
            height: 40px;
            padding: 0 12px;
            font-size: 14px;
          }

          .wds-input-element {
            flex: 1;
            border: none;
            outline: none;
            background: transparent;
            color: var(--wanted-color-text-primary, #171717);
            width: 100%;
            height: 100%;
            padding: 0;
          }

          .wds-input-element::placeholder {
            color: var(--wanted-color-text-placeholder, #8e9499);
          }

          /* Focus 상태 */
          .wds-input-container:focus-within {
            border-color: var(--wanted-color-primary, #3366ff);
            box-shadow: 0 0 0 2px var(--wanted-color-primary-subtle, rgba(51, 102, 255, 0.15));
          }

          /* Status: Warn */
          .wds-input-container.status-warn {
            border-color: var(--wanted-color-warning, #d69e2e);
          }
          .wds-input-container.status-warn:focus-within {
            box-shadow: 0 0 0 2px rgba(214, 158, 46, 0.2);
          }

          /* Status: Error */
          .wds-input-container.status-error {
            border-color: var(--wanted-color-danger, #e53e3e);
          }
          .wds-input-container.status-error:focus-within {
            box-shadow: 0 0 0 2px rgba(229, 62, 62, 0.2);
          }

          /* ReadOnly (금융 심사용 데이터 복사 가능 스타일) */
          .wds-input-container.is-readonly {
            background-color: var(--wanted-color-bg-gray, #f7f8f9);
            border-color: var(--wanted-color-border-subtle, #e1e4e6);
          }
          .wds-input-container.is-readonly .wds-input-element {
            color: var(--wanted-color-text-secondary, #4a4a4a);
            cursor: default;
          }

          /* Disabled */
          .wds-input-container.is-disabled {
            background-color: var(--wanted-color-bg-disabled, #f0f2f5);
            border-color: var(--wanted-color-border-subtle, #e1e4e6);
            cursor: not-allowed;
          }
          .wds-input-container.is-disabled .wds-input-element {
            cursor: not-allowed;
            color: var(--wanted-color-text-disabled, #a4a8ad);
          }

          .wds-input-suffix {
            margin-left: 8px;
            font-size: 13px;
            color: var(--wanted-color-text-secondary, #666);
            white-space: nowrap;
          }
        `}</style>
      </div>
    );
  }
);

Input.displayName = 'Input';
