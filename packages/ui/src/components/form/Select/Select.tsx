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
  selectSize?: SelectSize;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      placeholder = '선택해주세요',
      status = 'default',
      selectSize = 'md',
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={[
          'wds-select-container',
          `size-${selectSize}`,
          `status-${status}`,
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
          {...props}
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
       
        {/* 드롭다운 Chevron 아이콘 */}
        <span className="wds-select-arrow" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>

        <style jsx>{`
          .wds-select-container {
            position: relative;
            display: flex;
            align-items: center;
            width: 100%;
            border-radius: var(--wanted-radius-md, 6px);
            border: 1px solid var(--wanted-color-border-default, #e1e4e6);
            background-color: var(--wanted-color-bg-white, #ffffff);
            transition: all 0.15s ease-in-out;
            box-sizing: border-box;
          }

          .wds-select-container.size-sm {
            height: 32px;
            font-size: 13px;
          }
          .wds-select-container.size-md {
            height: 40px;
            font-size: 14px;
          }

          .wds-select-element {
            flex: 1;
            width: 100%;
            height: 100%;
            padding: 0 32px 0 12px;
            border: none;
            outline: none;
            background: transparent;
            color: var(--wanted-color-text-primary, #171717);
            appearance: none;
            cursor: pointer;
          }

          .wds-select-element:invalid,
          .wds-select-element option[value=""] {
            color: var(--wanted-color-text-placeholder, #8e9499);
          }

          .wds-select-arrow {
            position: absolute;
            right: 12px;
            pointer-events: none;
            color: var(--wanted-color-text-secondary, #666);
            display: flex;
            align-items: center;
          }

          .wds-select-container:focus-within {
            border-color: var(--wanted-color-primary, #3366ff);
            box-shadow: 0 0 0 2px var(--wanted-color-primary-subtle, rgba(51, 102, 255, 0.15));
          }

          .wds-select-container.status-warn {
            border-color: var(--wanted-color-warning, #d69e2e);
          }
          .wds-select-container.status-warn:focus-within {
            box-shadow: 0 0 0 2px rgba(214, 158, 46, 0.2);
          }

          .wds-select-container.status-error {
            border-color: var(--wanted-color-danger, #e53e3e);
          }
          .wds-select-container.status-error:focus-within {
            box-shadow: 0 0 0 2px rgba(229, 62, 62, 0.2);
          }

          .wds-select-container.is-disabled {
            background-color: var(--wanted-color-bg-disabled, #f0f2f5);
            cursor: not-allowed;
          }
          .wds-select-container.is-disabled .wds-select-element {
            cursor: not-allowed;
            color: var(--wanted-color-text-disabled, #a4a8ad);
          }
        `}</style>
      </div>
    );
  }
);

Select.displayName = 'Select';