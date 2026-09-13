'use client';

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, parse, isValid } from 'date-fns';
import { ko } from 'date-fns/locale';
import 'react-day-picker/style.css';

export type DatePickerStatus = 'default' | 'warn' | 'error';
export type DatePickerSize = 'sm' | 'md';

export interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'defaultValue' | 'onChange'> {
  value?: string;
  defaultValue?: string;
  status?: DatePickerStatus;
  inputSize?: DatePickerSize;
  isError?: boolean;
  onChange?: (dateString: string) => void;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      value,
      defaultValue = '',
      status = 'default',
      inputSize = 'md',
      isError,
      disabled,
      readOnly,
      className = '',
      onChange,
      ...props
    },
    ref
  ) => {
    const currentStatus = isError ? 'error' : status;
    const [isOpen, setIsOpen] = useState(false);

    // 초기 날짜 파싱
    const initialDateStr = value !== undefined ? value : defaultValue;
    const initialDate = initialDateStr ? parse(initialDateStr, 'yyyy-MM-dd', new Date()) : undefined;
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
      isValid(initialDate) ? initialDate : undefined
    );

    const containerRef = useRef<HTMLDivElement>(null);

    // 외부 클릭 시 팝오버 닫기
    useEffect(() => {
      const handleOutsideClick = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    // 날짜 선택 이벤트
    const handleSelect = (date: Date | undefined) => {
      if (date) {
        const formatted = format(date, 'yyyy-MM-dd');
        setSelectedDate(date);
        onChange?.(formatted);
      } else {
        setSelectedDate(undefined);
        onChange?.('');
      }
      setIsOpen(false);
    };

    const displayValue = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

    return (
      <div
        ref={containerRef}
        className={[
          'wds-datepicker-container',
          `size-${inputSize}`,
          `status-${currentStatus}`,
          disabled ? 'is-disabled' : '',
          readOnly ? 'is-readonly' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <input
          ref={ref}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label="날짜 선택"
          readOnly
          disabled={disabled}
          value={displayValue}
          onClick={() => !disabled && !readOnly && setIsOpen((prev) => !prev)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              !disabled && !readOnly && setIsOpen((prev) => !prev);
            }
          }}
          className="wds-datepicker-element"
          {...props}
        />

        <button
          type="button"
          tabIndex={-1}
          aria-label={isOpen ? '달력 닫기' : '달력 열기'}
          disabled={disabled || readOnly}
          onClick={() => setIsOpen((prev) => !prev)}
          className="wds-datepicker-icon-btn"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M12.667 2.667H3.333C2.597 2.667 2 3.264 2 4v9.333C2 14.07 2.597 14.667 3.333 14.667h9.334c.736 0 1.333-.597 1.333-1.334V4c0-.736-.597-1.333-1.333-1.333zM10.667 1.333v2.667M5.333 1.333v2.667M2 6.667h12"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isOpen && (
          <div
            className="wds-calendar-popover"
            role="dialog"
            aria-modal="true"
            aria-label="날짜 선택 달력"
          >
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              locale={ko}
              autoFocus
            />
          </div>
        )}

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
            cursor: pointer;
          }
          .wds-datepicker-icon-btn {
            background: none;
            border: none;
            padding: 0;
            display: flex;
            align-items: center;
            color: var(--wanted-color-text-tertiary, #8e9499);
            cursor: pointer;
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
          .wds-calendar-popover {
            position: absolute;
            top: calc(100% + 6px);
            left: 0;
            z-index: 1000;
            background-color: #ffffff;
            border: 1px solid var(--wanted-color-border-default, #e1e4e6);
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
            padding: 12px;
          }
        `}</style>
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';