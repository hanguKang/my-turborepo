'use client';

import React, { forwardRef } from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode;
  indeterminate?: boolean; // 전체 선택 시 일부만 선택된 상태 표현
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, checked, indeterminate, disabled, className = '', onChange, ...props }, ref) => {
    return (
      <label className={['wds-checkbox-label', disabled ? 'is-disabled' : '', className].filter(Boolean).join(' ')}>
        <span className="wds-checkbox-box">
          <input
            type="checkbox"
            ref={ref}
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            className="wds-checkbox-native"
            {...props}
          />
          <span className={['wds-checkbox-custom', checked ? 'is-checked' : '', indeterminate ? 'is-indeterminate' : ''].filter(Boolean).join(' ')}>
            {indeterminate ? (
              <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
                <rect width="10" height="2" rx="1" fill="currentColor" />
              </svg>
            ) : checked ? (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.8 7L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
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
          }
          .wds-checkbox-label.is-disabled {
            cursor: not-allowed;
            opacity: 0.5;
          }
          .wds-checkbox-native {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
          }
          .wds-checkbox-custom {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 18px;
            height: 18px;
            border-radius: var(--wanted-radius-sm, 4px);
            border: 1px solid var(--wanted-color-border-default, #caced3);
            background-color: var(--wanted-color-bg-white, #ffffff);
            color: #ffffff;
            transition: all 0.15s ease-in-out;
          }
          .wds-checkbox-label:hover:not(.is-disabled) .wds-checkbox-custom {
            border-color: var(--wanted-color-primary, #3366ff);
          }
          .wds-checkbox-custom.is-checked,
          .wds-checkbox-custom.is-indeterminate {
            background-color: var(--wanted-color-primary, #3366ff);
            border-color: var(--wanted-color-primary, #3366ff);
          }
          .wds-checkbox-text {
            font-size: 14px;
            color: var(--wanted-color-text-primary, #171717);
          }
        `}</style>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';