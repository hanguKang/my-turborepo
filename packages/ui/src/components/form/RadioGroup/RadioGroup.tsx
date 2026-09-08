'use client';

import React from 'react';

export interface RadioOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string | number;
  onChange: (value: any) => void;
  direction?: 'row' | 'column';
  disabled?: boolean;
}

export const RadioGroup = ({
  name,
  options,
  value,
  onChange,
  direction = 'row',
  disabled = false,
}: RadioGroupProps) => {
  return (
    <div className={`wds-radiogroup-container direction-${direction}`} role="radiogroup">
      {options.map((opt) => {
        const isChecked = opt.value === value;
        const isDisabled = disabled || opt.disabled;

        return (
          <label
            key={String(opt.value)}
            className={['wds-radio-label', isDisabled ? 'is-disabled' : ''].filter(Boolean).join(' ')}
          >
            <span className="wds-radio-box">
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={isChecked}
                disabled={isDisabled}
                onChange={() => onChange(opt.value)}
                className="wds-radio-native"
              />
              <span className={['wds-radio-custom', isChecked ? 'is-checked' : ''].filter(Boolean).join(' ')}>
                {isChecked && <span className="wds-radio-inner-dot" />}
              </span>
            </span>
            <span className="wds-radio-text">{opt.label}</span>
          </label>
        );
      })}

      <style jsx>{`
        .wds-radiogroup-container {
          display: flex;
          gap: 16px;
        }
        .direction-column {
          flex-direction: column;
          gap: 8px;
        }
        .wds-radio-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
        }
        .wds-radio-label.is-disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        .wds-radio-native {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }
        .wds-radio-custom {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 1px solid var(--wanted-color-border-default, #caced3);
          background-color: var(--wanted-color-bg-white, #ffffff);
          transition: all 0.15s ease-in-out;
        }
        .wds-radio-label:hover:not(.is-disabled) .wds-radio-custom {
          border-color: var(--wanted-color-primary, #3366ff);
        }
        .wds-radio-custom.is-checked {
          border-color: var(--wanted-color-primary, #3366ff);
        }
        .wds-radio-inner-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--wanted-color-primary, #3366ff);
        }
        .wds-radio-text {
          font-size: 14px;
          color: var(--wanted-color-text-primary, #171717);
        }
      `}</style>
    </div>
  );
};