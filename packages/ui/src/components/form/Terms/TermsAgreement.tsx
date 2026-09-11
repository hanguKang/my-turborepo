'use client';

import React from 'react';

interface TermsAgreementProps {
  isAgreed: boolean;
  onChange: (agreed: boolean) => void;
  error?: string;
}

export function TermsAgreement({ isAgreed, onChange, error }: TermsAgreementProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          backgroundColor: '#F9FAFB',
          borderRadius: '10px',
          border: error ? '1px solid #EF4444' : '1px solid #E5E7EB',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            checked={isAgreed}
            onChange={(e) => onChange(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: '#1E64FF', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
            [필수] 대출 심사 및 신용정보 제공 전체 동의
          </span>
        </div>
        <span style={{ fontSize: '12px', color: '#6B7280', textDecoration: 'underline' }}>
          상세보기
        </span>
      </label>
      {error && (
        <span style={{ fontSize: '12px', color: '#EF4444', marginLeft: '4px' }}>
          {error}
        </span>
      )}
    </div>
  );
}