'use client';

import React, { useState } from 'react';
import { Field, Input } from '@repo/ui';

interface GuarantorSectionProps {
  value?: string;
  onChange: (val: string | undefined) => void;
  error?: string;
}

export function GuarantorSection({ value, onChange, error }: GuarantorSectionProps) {
  const [hasGuarantor, setHasGuarantor] = useState(Boolean(value));

  const handleToggle = (checked: boolean) => {
    setHasGuarantor(checked);
    if (!checked) {
      onChange(undefined); // 끄면 undefined로 초기화하여 zod refine 통과
    }
  };

  return (
    <div style={{ padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>보증인 등록 (선택)</div>
          <div style={{ fontSize: '12px', color: '#6B7280' }}>보증인 입보 시 한도가 상향될 수 있습니다.</div>
        </div>
        <input
          type="checkbox"
          checked={hasGuarantor}
          onChange={(e) => handleToggle(e.target.checked)}
          style={{ width: '18px', height: '18px', accentColor: '#1E64FF', cursor: 'pointer' }}
        />
      </div>

      {hasGuarantor && (
        <Field label="보증인 식별 코드" error={error} helperText="발급받은 'SEC_' 시작 코드를 입력하세요.">
          <Input
            placeholder="SEC_XXXXXX"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            status={error ? 'error' : 'default'}
          />
        </Field>
      )}
    </div>
  );
}