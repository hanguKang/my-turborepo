'use client';

import React from 'react';

export interface FieldProps {
  label?: string;
  required?: boolean;
  error?: string;       // 👈 에러 메시지
  warn?: string;        // 👈 경고 메시지
  helperText?: string;  // 👈 기본 안내 문구
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Field = ({
  label,
  required,
  error,
  warn,
  helperText,
  disabled,
  children,
  className = '',
}: FieldProps) => {
  // 우선순위: error > warn
  const statusClass = error ? 'status-error' : warn ? 'status-warn' : '';

  return (
    <div className={`field-root ${disabled ? 'is-disabled' : ''} ${className}`}>
      {label && (
        <label className="field-label">
          {label}
          {required && <span className="field-asterisk" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="field-control">{children}</div>

      {/* 우선순위에 따라 에러 > 경고 > 일반 안내문 순으로 노출 */}
      {error ? (
        <p className="field-status-message status-error" role="alert">
          {error}
        </p>
      ) : warn ? (
        <p className="field-status-message status-warn" role="alert">
          {warn}
        </p>
      ) : helperText ? (
        <p className="field-helper-text">{helperText}</p>
      ) : null}

      <style jsx>{`
        .field-root {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
        }
        .field-label {
          font-size: var(--wanted-typography-label, 13px);
          font-weight: 600;
          color: var(--wanted-color-text-secondary, #4a4a4a);
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .field-asterisk {
          color: var(--wanted-color-danger, #ff4d4f);
        }
        .field-status-message {
          font-size: var(--wanted-typography-caption, 12px);
          margin: 0;
          line-height: 1.4;
        }
        .field-status-message.status-error {
          color: var(--wanted-color-danger, #e53e3e);
        }
        .field-status-message.status-warn {
          color: var(--wanted-color-warning, #d69e2e);
        }
        .field-helper-text {
          font-size: var(--wanted-typography-caption, 12px);
          color: var(--wanted-color-text-tertiary, #8c8c8c);
          margin: 0;
        }
        .field-root.is-disabled {
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
};