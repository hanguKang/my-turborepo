'use client';

import React from 'react';

interface SimpleTermsProps {
  id: string;
  label: string;
  checked: boolean;
  required?: boolean;
  onChange: (checked: boolean) => void;
  onOpenDetail: () => void;
}

export function SimpleTerms({
  id,
  label,
  checked,
  required = false,
  onChange,
  onOpenDetail,
}: SimpleTermsProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 14px',
        backgroundColor: '#F9FAFB',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
      }}
    >
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1 }}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          style={{ width: '18px', height: '18px', accentColor: '#1E64FF' }}
        />
        <span style={{ fontSize: '14px', color: '#1F2937' }}>
          <strong style={{ color: required ? '#1E64FF' : '#6B7280', marginRight: '4px' }}>
            [{required ? '필수' : '선택'}]
          </strong>
          {label}
        </span>
      </label>
      <button
        type="button"
        onClick={onOpenDetail}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '12px',
          color: '#6B7280',
          textDecoration: 'underline',
          cursor: 'pointer',
          padding: '4px',
        }}
      >
        보기
      </button>
    </div>
  );
}