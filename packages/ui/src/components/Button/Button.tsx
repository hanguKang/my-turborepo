'use client';

import React, { forwardRef } from 'react';
import { useTheme } from '@emotion/react';

export type ButtonVariant = 'solid' | 'outline' | 'subtle' | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg'; // sm: 32px(고밀도), md: 40px(기본), lg: 52px(CTA)
export type ButtonColor = 'primary' | 'danger' | 'neutral';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    color?: ButtonColor;
    fullWidth?: boolean;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'solid',
            size = 'md',
            color = 'primary',
            fullWidth = false,
            isLoading = false,
            leftIcon,
            rightIcon,
            disabled,
            className = '',
            children,
            ...props
        },
        ref
    ) => {
        const theme = useTheme() as any;
        const colors = theme?.colors || {};

        const isDisabled = disabled || isLoading;

        return (
            <button
                ref={ref}
                disabled={isDisabled}
                className={[
                    'wds-btn',
                    `variant-${variant}`,
                    `size-${size}`,
                    `color-${color}`,
                    fullWidth ? 'is-full-width' : '',
                    isLoading ? 'is-loading' : '',
                    className,
                ]
                    .filter(Boolean)
                    .join(' ')}
                {...props}
            >
                {/* 로딩 스피너 */}
                {isLoading && (
                    <span className="wds-btn-spinner" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                            <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray="31.415, 31.415"
                            />
                        </svg>
                    </span>
                )}

                <span className="wds-btn-content">
                    {leftIcon && <span className="wds-btn-icon left">{leftIcon}</span>}
                    <span className="wds-btn-text">{children}</span>
                    {rightIcon && <span className="wds-btn-icon right">{rightIcon}</span>}
                </span>

                <style jsx>{`
          .wds-btn {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: ${theme?.radii?.md || 'var(--wds-radius-md, 8px)'};
            font-family: inherit;
            font-weight: 600;
            line-height: 1;
            white-space: nowrap;
            vertical-align: middle;
            cursor: pointer;
            user-select: none;
            box-sizing: border-box;
            outline: none;
            transition:
              background-color 0.15s ease,
              border-color 0.15s ease,
              color 0.15s ease,
              transform 0.08s ease;
          }

          /* 금융 앱 전형 액티브 눌림 인터랙션 */
          .wds-btn:active:not(:disabled) {
            transform: scale(0.975);
          }

          .wds-btn.is-full-width {
            width: 100%;
          }

          /* --- 사이즈 규격 --- */
          .wds-btn.size-sm {
            height: 32px;
            padding: 0 10px;
            font-size: 13px;
            gap: 4px;
          }
          .wds-btn.size-md {
            height: 40px;
            padding: 0 14px;
            font-size: 14px;
            gap: 6px;
          }
          .wds-btn.size-lg {
            height: 52px;
            padding: 0 20px;
            font-size: 16px;
            border-radius: ${theme?.radii?.lg || 'var(--wds-radius-lg, 12px)'};
            gap: 8px;
          }

          /* --- 내용 정렬 및 로딩 시 숨김 --- */
          .wds-btn-content {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: inherit;
            visibility: ${isLoading ? 'hidden' : 'visible'};
          }

          .wds-btn-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 1.15em;
          }

          /* --- 스피너 애니메이션 --- */
          .wds-btn-spinner {
            position: absolute;
            inset: 0;
            margin: auto;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: spin 0.8s linear infinite;
          }

          .wds-btn-spinner svg {
            width: 100%;
            height: 100%;
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          /* ============================================================ */
          /* 1. Solid Variant (Primary / Danger / Neutral)                 */
          /* ============================================================ */
          .wds-btn.variant-solid.color-primary {
            background-color: ${colors.primary?.main || 'var(--wds-color-primary, #3366ff)'};
            color: #ffffff;
            border: 0;
          }
          .wds-btn.variant-solid.color-primary:hover:not(:disabled) {
            background-color: ${colors.primary?.hover || 'var(--wds-color-primary-hover, #254edb)'};
          }

          .wds-btn.variant-solid.color-danger {
            background-color: ${colors.status?.danger || 'var(--wds-color-danger, #e53e3e)'};
            color: #ffffff;
            border: 0;
          }
          .wds-btn.variant-solid.color-danger:hover:not(:disabled) {
            background-color: ${colors.status?.dangerHover || '#c53030'};
          }

          .wds-btn.variant-solid.color-neutral {
            background-color: ${colors.bg?.gray || 'var(--wds-color-bg-gray, #f2f4f6)'};
            color: ${colors.text?.primary || 'var(--wds-color-text-primary, #191f28)'};
            border: 0;
          }
          .wds-btn.variant-solid.color-neutral:hover:not(:disabled) {
            background-color: ${colors.bg?.grayHover || '#e5e8eb'};
          }

          /* ============================================================ */
          /* 2. Outline Variant                                           */
          /* ============================================================ */
          .wds-btn.variant-outline.color-primary {
            background-color: ${colors.bg?.white || '#ffffff'};
            color: ${colors.primary?.main || '#3366ff'};
            border: 1px solid ${colors.primary?.main || '#3366ff'};
          }
          .wds-btn.variant-outline.color-primary:hover:not(:disabled) {
            background-color: ${colors.primary?.subtle || 'rgba(51, 102, 255, 0.06)'};
          }

          .wds-btn.variant-outline.color-neutral {
            background-color: ${colors.bg?.white || '#ffffff'};
            color: ${colors.text?.primary || '#333d4b'};
            border: 1px solid ${colors.border?.default || 'var(--wds-color-border-default, #e1e4e6)'};
          }
          .wds-btn.variant-outline.color-neutral:hover:not(:disabled) {
            background-color: ${colors.bg?.gray || '#f9fafb'};
          }

          /* ============================================================ */
          /* 3. Subtle Variant (소프트 버튼)                              */
          /* ============================================================ */
          .wds-btn.variant-subtle.color-primary {
            background-color: ${colors.primary?.subtle || 'rgba(51, 102, 255, 0.1)'};
            color: ${colors.primary?.main || '#3366ff'};
            border: 0;
          }
          .wds-btn.variant-subtle.color-primary:hover:not(:disabled) {
            background-color: ${colors.primary?.subtleHover || 'rgba(51, 102, 255, 0.16)'};
          }

          /* ============================================================ */
          /* 4. Text Variant (텍스트 링크 버튼)                           */
          /* ============================================================ */
          .wds-btn.variant-text {
            background-color: transparent;
            border: 0;
            padding-left: 4px;
            padding-right: 4px;
            height: auto;
            min-height: auto;
          }
          .wds-btn.variant-text.color-primary {
            color: ${colors.primary?.main || '#3366ff'};
          }
          .wds-btn.variant-text.color-neutral {
            color: ${colors.text?.secondary || '#6b7684'};
          }
          .wds-btn.variant-text:hover:not(:disabled) {
            text-decoration: underline;
          }
          .wds-btn.variant-text:active:not(:disabled) {
            transform: none;
            opacity: 0.7;
          }

          /* ============================================================ */
          /* Disabled & Loading 공통                                      */
          /* ============================================================ */
          .wds-btn:disabled {
            cursor: not-allowed;
            background-color: ${colors.bg?.disabled || 'var(--wds-color-bg-disabled, #f0f2f5)'};
            color: ${colors.text?.disabled || 'var(--wds-color-text-disabled, #a4a8ad)'};
            border-color: ${colors.border?.subtle || '#e1e4e6'};
            transform: none;
          }
          .wds-btn.variant-text:disabled {
            background-color: transparent;
            text-decoration: none;
          }
        `}</style>
            </button>
        );
    }
);

Button.displayName = 'Button';