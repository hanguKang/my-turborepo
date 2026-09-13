'use client';

import React from 'react';
import { useTheme } from '@emotion/react';

export interface RadioOption {
  label: React.ReactNode;
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
  /** 유효성 검증 실패 시 에러 상태 테두리 적용 */
  isError?: boolean;
  className?: string;
}

export const RadioGroup = ({
  name,
  options,
  value,
  onChange,
  direction = 'row',
  disabled = false,
  isError = false,
  className = '',
}: RadioGroupProps) => {
  const theme = useTheme() as any;
  const colors = theme?.colors || {};

  return (
    <div
      role="radiogroup"
      className={[
        'wds-radiogroup-container',
        `direction-${direction}`,
        isError ? 'has-error' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {options.map((opt) => {
        const isChecked = opt.value === value;
        const isDisabled = disabled || opt.disabled;

        return (
          <label
            key={String(opt.value)}
            className={[
              'wds-radio-label',
              isDisabled ? 'is-disabled' : '',
              isChecked ? 'is-checked' : '',
            ]
              .filter(Boolean)
              .join(' ')}
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
              <span
                className={[
                  'wds-radio-custom',
                  isChecked ? 'is-checked' : '',
                  isError ? 'is-error' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
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
          gap: 10px;
        }

        .wds-radio-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
          position: relative;
        }

        .wds-radio-box {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
        }

        /* 접근성: 숨겨진 네이티브 인풋 */
        .wds-radio-native {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          margin: 0;
          cursor: pointer;
        }

        /* 커스텀 원형 라디오 외형 */
        .wds-radio-custom {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 1.5px solid ${colors.border?.default || 'var(--wds-color-border-default, #caced3)'};
          background-color: ${colors.bg?.white || 'var(--wds-color-bg-white, #ffffff)'};
          transition: all 0.15s ease-in-out;
          box-sizing: border-box;
        }

        /* 1. Hover 상태 */
        .wds-radio-label:hover:not(.is-disabled) .wds-radio-custom:not(.is-error) {
          border-color: ${colors.primary?.main || 'var(--wds-color-primary, #3366ff)'};
        }

        /* 2. Checked 상태 */
        .wds-radio-custom.is-checked {
          border-color: ${colors.primary?.main || 'var(--wds-color-primary, #3366ff)'};
          background-color: ${colors.bg?.white || '#ffffff'};
        }

        /* 가운데 채워지는 점 */
        .wds-radio-inner-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: ${colors.primary?.main || 'var(--wds-color-primary, #3366ff)'};
          transform: scale(1);
          transition: transform 0.12s ease-in-out;
        }

        /* 3. Focus-Visible (키보드 탭 이동 접근성 링) */
        .wds-radio-native:focus-visible + .wds-radio-custom {
          outline: 2px solid ${colors.primary?.main || '#3366ff'};
          outline-offset: 2px;
        }

        /* 4. Error 상태 */
        .wds-radio-custom.is-error {
          border-color: ${colors.status?.danger || 'var(--wds-color-danger, #e53e3e)'};
        }
        .wds-radio-custom.is-error.is-checked .wds-radio-inner-dot {
          background-color: ${colors.status?.danger || '#e53e3e'};
        }

        /* 5. Disabled 상태 */
        .wds-radio-label.is-disabled {
          cursor: not-allowed;
        }
        .wds-radio-label.is-disabled .wds-radio-custom {
          background-color: ${colors.bg?.disabled || 'var(--wds-color-bg-disabled, #f0f2f5)'};
          border-color: ${colors.border?.subtle || '#e1e4e6'};
        }
        .wds-radio-label.is-disabled .wds-radio-inner-dot {
          background-color: ${colors.text?.disabled || '#a4a8ad'};
        }
        .wds-radio-label.is-disabled .wds-radio-text {
          color: ${colors.text?.disabled || 'var(--wds-color-text-disabled, #a4a8ad)'};
        }

        /* 텍스트 라벨 */
        .wds-radio-text {
          font-size: 14px;
          line-height: 20px;
          color: ${colors.text?.primary || 'var(--wds-color-text-primary, #191f28)'};
          transition: color 0.15s ease;
        }
      `}</style>
    </div>
  );
};