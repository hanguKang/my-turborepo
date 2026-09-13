'use client';

import React from 'react';
import { useTheme } from '@emotion/react';

export interface FieldProps {
  label?: string;
  required?: boolean;
  error?: string;       // 에러 메시지 (우선순위 1)
  warn?: string;        // 경고 메시지 (우선순위 2)
  helperText?: string;  // 기본 안내 문구 (우선순위 3)
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Field = ({
  label,
  required = false,
  error,
  warn,
  helperText,
  disabled = false,
  children,
  className = '',
}: FieldProps) => {
  const theme = useTheme() as any;
  const colors = theme?.colors || {};

  // 상태 우선순위: error > warn > default
  const status = error ? 'error' : warn ? 'warn' : 'default';
  const isError = Boolean(error);

  // ⭐️ 자식 요소(Input, RadioGroup, Checkbox 등)에 상태 및 disabled 자동 전파
  const enhancedChildren = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<any>, {
      status: (children.props as any).status || status,
      isError: (children.props as any).isError !== undefined ? (children.props as any).isError : isError,
      disabled: (children.props as any).disabled !== undefined ? (children.props as any).disabled : disabled,
    })
    : children;

  return (
    <div
      className={[
        'field-root',
        `status-${status}`,
        disabled ? 'is-disabled' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label && (
        <label className="field-label">
          <span>{label}</span>
          {required && (
            <span className="field-asterisk" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="field-control">{enhancedChildren}</div>

      {/* 우선순위에 따른 피드백 메시지 노출 */}
      {error ? (
        <p className="field-status-message status-error" role="alert">
          <svg className="field-status-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4.5zm0 8a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
          <span>{error}</span>
        </p>
      ) : warn ? (
        <p className="field-status-message status-warn" role="alert">
          <svg className="field-status-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4.5zm0 8a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
          <span>{warn}</span>
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
          color: ${colors.text?.secondary || 'var(--wanted-color-text-secondary, #4a4a4a)'};
          display: flex;
          align-items: center;
          gap: 2px;
          user-select: none;
        }

        .field-asterisk {
          color: ${colors.status?.danger || 'var(--wanted-color-danger, #ff4d4f)'};
          font-size: 13px;
          font-weight: 700;
          margin-left: 1px;
        }

        .field-control {
          width: 100%;
        }

        .field-status-message {
          display: flex;
          align-items: flex-start;
          gap: 4px;
          font-size: var(--wanted-typography-caption, 12px);
          margin: 0;
          line-height: 1.4;
          word-break: break-word;
        }

        .field-status-icon {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .field-status-message.status-error {
          color: ${colors.status?.danger || 'var(--wanted-color-danger, #e53e3e)'};
          font-weight: 500;
        }

        .field-status-message.status-warn {
          color: ${colors.status?.warning || 'var(--wanted-color-warning, #d69e2e)'};
          font-weight: 500;
        }

        .field-helper-text {
          font-size: var(--wanted-typography-caption, 12px);
          color: ${colors.text?.tertiary || 'var(--wanted-color-text-tertiary, #8c8c8c)'};
          margin: 0;
          line-height: 1.4;
        }

        .field-root.is-disabled {
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
};

Field.displayName = 'Field';