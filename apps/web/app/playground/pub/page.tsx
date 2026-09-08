'use client';

import React, { useState } from 'react';
import {
  Field,
  Input,
  CurrencyInput,
  MaskedInput,
  Select,
  RadioGroup,
  Switch,
  DatePicker,
  LookupInput,
  FileUpload,
} from '@repo/ui';

export default function MobileLoanApplyPage() {
  // 폼 상태
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [businessNo, setBusinessNo] = useState({ formatted: '', raw: '' });
  const [repayType, setRepayType] = useState('bullet'); // 만기일시
  const [isEarlyRepayExempt, setIsEarlyRepayExempt] = useState(false);
  const [files, setFiles] = useState<{ id: string; name: string; size: number }[]>([]);

  // 파일 업로드 핸들러
  const handleUpload = (newFiles: File[]) => {
    const items = newFiles.map((file) => ({
      id: `${Date.now()}-${file.name}`,
      name: file.name,
      size: file.size,
    }));
    setFiles((prev) => [...prev, ...items]);
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="mobile-container">
      <header className="page-header">
        <h2>기업 운영자금 대출 신청</h2>
        <p>사업자 정보와 희망 여신 조건을 입력해 주세요.</p>
      </header>

      <form className="form-body" onSubmit={(e) => e.preventDefault()}>
        {/* 1. 사업자 번호 (MaskedInput) */}
        <Field label="사업자등록번호" required helperText="하이픈(-) 없이 숫자만 입력하세요">
          <MaskedInput
            maskType="business-no"
            placeholder="000-00-00000"
            inputSize="md"
            onValueChange={(formatted, raw) => setBusinessNo({ formatted, raw })}
          />
        </Field>

        {/* 2. 법인/기업명 검색 (LookupInput) */}
        <Field label="법인 상호명" required>
          <LookupInput
            placeholder="상호명을 검색하세요"
            onSearchClick={() => alert('기업 정보 조회 팝업 호출')}
          />
        </Field>

        {/* 3. 대출 신청 금액 (CurrencyInput) */}
        <Field
          label="희망 대출금액"
          required
          warn={loanAmount >= 500_000_000 ? '5억 이상 신청 건은 본점 심사 대상입니다.' : undefined}
        >
          <CurrencyInput
            placeholder="금액을 입력하세요"
            onValueChange={(val) => setLoanAmount(val)}
          />
        </Field>

        {/* 4. 여신 과목 선택 (Select) */}
        <Field label="대출 과목" required>
          <Select
            options={[
              { label: '중소기업 운전자금대출', value: 'op_loan' },
              { label: '시설자금대출', value: 'fac_loan' },
              { label: '스마트공장 보증연계대출', value: 'smart_loan' },
            ]}
            defaultValue="op_loan"
          />
        </Field>

        {/* 5. 희망 실행일 (DatePicker) */}
        <Field label="대출 희망 실행일" required>
          <DatePicker defaultValue="2026-10-01" />
        </Field>

        {/* 6. 상환 방식 (RadioGroup) */}
        <Field label="상환 방식" required>
          <RadioGroup
            name="repayType"
            direction="column"
            value={repayType}
            onChange={(val) => setRepayType(val)}
            options={[
              { label: '만기일시상환 (1년 단위 연장)', value: 'bullet' },
              { label: '원금균등분할상환', value: 'equal_principal' },
              { label: '원리금균등분할상환', value: 'equal_pi' },
            ]}
          />
        </Field>

        {/* 7. 특약 스위치 (Switch) */}
        <div className="switch-row">
          <Switch
            checked={isEarlyRepayExempt}
            onChange={setIsEarlyRepayExempt}
            label="중도상환수수료 감면 특약 신청"
          />
        </div>

        {/* 8. 증빙 서류 업로드 (FileUpload) */}
        <Field label="필수 증빙 서류" helperText="사업자등록증명원, 부가세과세표준증명 (PDF, JPG)">
          <FileUpload
            files={files}
            onUpload={handleUpload}
            onRemove={handleRemoveFile}
            maxSizeMB={20}
          />
        </Field>

        {/* 제출 버튼 */}
        <div className="submit-box">
          <button type="button" className="btn-submit">
            대출 심사 신청하기
          </button>
        </div>
      </form>

      <style jsx>{`
        .mobile-container {
          max-width: 480px;
          margin: 0 auto;
          min-height: 100vh;
          background-color: #ffffff;
          padding: 24px 20px 40px;
          box-sizing: border-box;
        }

        .page-header {
          margin-bottom: 24px;
        }

        .page-header h2 {
          font-size: 20px;
          font-weight: 700;
          color: #171717;
          margin: 0 0 6px;
        }

        .page-header p {
          font-size: 13px;
          color: #767676;
          margin: 0;
        }

        .form-body {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .switch-row {
          padding: 12px 0;
          border-top: 1px solid #f0f2f5;
          border-bottom: 1px solid #f0f2f5;
        }

        .submit-box {
          margin-top: 16px;
        }

        .btn-submit {
          width: 100%;
          height: 48px;
          background-color: var(--wanted-color-primary, #3366ff);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .btn-submit:active {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}