'use client';

import React, { forwardRef } from 'react';
import { Input, InputProps } from '../Input/Input';

export interface LookupInputProps extends InputProps {
  onSearchClick: () => void;
  searchButtonAriaLabel?: string;
}

export const LookupInput = forwardRef<HTMLInputElement, LookupInputProps>(
  ({ onSearchClick, searchButtonAriaLabel = '검색 팝업 열기', disabled, inputSize = 'md', ...props }, ref) => {
    return (
      <div className="wds-lookup-wrapper">
        <Input
          ref={ref}
          disabled={disabled}
          inputSize={inputSize}
          className="lookup-input-target"
          {...props}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={onSearchClick}
          aria-label={searchButtonAriaLabel}
          className={['wds-lookup-btn', `size-${inputSize}`].filter(Boolean).join(' ')}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path
              d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667zM14 14l-2.9-2.9"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <style jsx>{`
          .wds-lookup-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            width: 100%;
          }
          :global(.lookup-input-target input) {
            padding-right: 36px !important;
          }
          .wds-lookup-btn {
            position: absolute;
            right: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            background: transparent;
            color: var(--wanted-color-text-secondary, #4a4a4a);
            border-radius: var(--wanted-radius-sm, 4px);
            cursor: pointer;
            transition: all 0.15s ease;
          }
          .wds-lookup-btn.size-sm {
            width: 22px;
            height: 22px;
          }
          .wds-lookup-btn.size-md {
            width: 28px;
            height: 28px;
          }
          .wds-lookup-btn:hover:not(:disabled) {
            background-color: var(--wanted-color-bg-hover, #f0f2f5);
            color: var(--wanted-color-primary, #3366ff);
          }
          .wds-lookup-btn:disabled {
            cursor: not-allowed;
            color: var(--wanted-color-text-disabled, #a4a8ad);
          }
        `}</style>
      </div>
    );
  }
);

LookupInput.displayName = 'LookupInput';
