'use client';

import React from 'react';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  size?: 'sm' | 'md';
}

export const Switch = ({
  checked,
  onChange,
  disabled = false,
  label,
  size = 'md',
}: SwitchProps) => {
  return (
    <label className={`wds-switch-label ${disabled ? 'is-disabled' : ''}`}>
      <span className={`wds-switch-track size-${size} ${checked ? 'is-checked' : ''}`}>
        <input
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="wds-switch-native"
        />
        <span className="wds-switch-thumb" />
      </span>
      {label && <span className="wds-switch-text">{label}</span>}

      <style jsx>{`
        .wds-switch-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
        }
        .wds-switch-label.is-disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        .wds-switch-native {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }
        .wds-switch-track {
          position: relative;
          display: inline-block;
          border-radius: 9999px;
          background-color: var(--wanted-color-control-off, #caced3);
          transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* 사이즈 */
        .wds-switch-track.size-sm {
          width: 32px;
          height: 18px;
        }
        .wds-switch-track.size-md {
          width: 42px;
          height: 24px;
        }

        /* ON 상태 배경 */
        .wds-switch-track.is-checked {
          background-color: var(--wanted-color-primary, #3366ff);
        }

        .wds-switch-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          background-color: #ffffff;
          border-radius: 50%;
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .size-sm .wds-switch-thumb {
          width: 14px;
          height: 14px;
        }
        .size-md .wds-switch-thumb {
          width: 20px;
          height: 20px;
        }

        /* ON 상태 썸 이동 */
        .wds-switch-track.size-sm.is-checked .wds-switch-thumb {
          transform: translateX(14px);
        }
        .wds-switch-track.size-md.is-checked .wds-switch-thumb {
          transform: translateX(18px);
        }

        .wds-switch-text {
          font-size: 14px;
          color: var(--wanted-color-text-primary, #171717);
        }
      `}</style>
    </label>
  );
};
