'use client';

import React, { forwardRef } from 'react';

export type DatePickerStatus = 'default' | 'warn' | 'error';
export type DatePickerSize = 'sm' | 'md';

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  status?: DatePickerStatus;
  inputSize?: DatePickerSize;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ status = 'default', inputSize = 'md', disabled, readOnly, className = '', ...props }, ref) => {
    return (
      <div
        className={[
          'wds-datepicker-container',
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
          type="date"
          disabled={disabled}
          readOnly={readOnly}
          className="wds-datepicker-element"
          {...props}
        />
        <span className="wds-datepicker-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M12.667 2.667H3.333C2.597 2.667 2 3.264 2 4v9.333C2 14.07 2.597 14.667 3.333 14.667h9.334c.736 0 1.333-.597 1.333-1.334V4c0-.736-.597-1.333-1.333-1.333zM10.667 1.333v2.667M5.333 1.333v2.667M2 6.667h12"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <style jsx>{`
          .wds-datepicker-container {
            position: relative;
            display: flex;
            align-items: center;
            width: 100%;
            border-radius: var(--wanted-radius-md, 6px);
            border: 1px solid var(--wanted-color-border-default, #e1e4e6);
            background-color: var(--wanted-color-bg-white, #ffffff);
            box-sizing: border-box;
            transition: all 0.15s ease-in-out;
          }
          .size-sm {
            height: 32px;
            padding: 0 10px;
            font-size: 13px;
          }
          .size-md {
            height: 40px;
            padding: 0 12px;
            font-size: 14px;
          }
          .wds-datepicker-element {
            flex: 1;
            width: 100%;
            height: 100%;
            border: none;
            outline: none;
            background: transparent;
            color: var(--wanted-color-text-primary, #171717);
            font-family: inherit;
          }
          .wds-datepicker-element::-webkit-calendar-picker-indicator {
            position: absolute;
            right: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
          }
          .wds-datepicker-icon {
            pointer-events: none;
            color: var(--wanted-color-text-tertiary, #8e9499);
            display: flex;
            align-items: center;
          }
          .wds-datepicker-container:focus-within {
            border-color: var(--wanted-color-primary, #3366ff);
            box-shadow: 0 0 0 2px var(--wanted-color-primary-subtle, rgba(51, 102, 255, 0.15));
          }
          .status-warn {
            border-color: var(--wanted-color-warning, #d69e2e);
          }
          .status-error {
            border-color: var(--wanted-color-danger, #e53e3e);
          }
          .is-readonly {
            background-color: var(--wanted-color-bg-gray, #f7f8f9);
          }
          .is-disabled {
            background-color: var(--wanted-color-bg-disabled, #f0f2f5);
            cursor: not-allowed;
            opacity: 0.6;
          }
        `}</style>
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';