'use client';

import React, { useState, useRef } from 'react';
import {
  Field,
  CurrencyInput,
  MaskedInput,
  Select,
  RadioGroup,
  Switch,
  DatePicker,
  LookupInput,
  FileUpload,
  FileItem,
  isValidBusinessNo,
} from '@repo/ui';

isValidBusinessNo

export default function MobileLoanApplyPage() {
  // 1. 폼 데이터 상태
  const [businessNo, setBusinessNo] = useState({ formatted: '', raw: '' });
  const [companyName, setCompanyName] = useState('');
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [repayType, setRepayType] = useState('bullet');
  const [execDate, setExecDate] = useState('2026-10-01');
  const [isEarlyRepayExempt, setIsEarlyRepayExempt] = useState(false);
  const [files, setFiles] = useState<{ id: string; name: string; size: number }[]>([]);

  // 2. Touched 상태 (사용자가 입력을 시도하고 필드를 벗어났는지 추적)
  const [touched, setTouched] = useState({
    businessNo: false,
    companyName: false,
    loanAmount: false,
    files: false,
  });

  // 3. 에러 발생 시 자동 포커스를 위한 Refs
  const businessNoRef = useRef<HTMLInputElement>(null);
  const companyNameRef = useRef<HTMLInputElement>(null);
  const loanAmountRef = useRef<HTMLInputElement>(null);

  // 4. 필드별 실시간 유효성 계산
  // (1) 사업자등록번호: 10자리 유효성 검사 (validators.ts 연동)
  const isBusinessNoError =
    touched.businessNo && (businessNo.raw.length === 0 || !isValidBusinessNo(businessNo.raw));

  // (2) 법인 상호명: 필수 입력 및 조회 여부
  const isCompanyNameError = touched.companyName && companyName.trim().length === 0;

  // (3) 대출 신청 금액: 0원 초과 필수, 10억 초과 시 에러, 5억 이상 시 warn
  const isLoanAmountError = touched.loanAmount && (loanAmount <= 0 || loanAmount > 1_000_000_000);
  const isLoanAmountWarn = loanAmount >= 500_000_000 && loanAmount <= 1_000_000_000;

  // (4) 필수 증빙 서류: 최소 1개 이상 업로드 필수
  const isFilesError = touched.files && files.length === 0;

  // 파일 업로드 핸들러
  const handleUpload = (newFiles: FileItem[]) => {
    const items = newFiles.map((file) => ({
      id: `${Date.now()}-${file.name}`,
      name: file.name,
      size: file.size,
    }));
    setFiles((prev) => [...prev, ...items]);
    setTouched((prev) => ({ ...prev, files: true }));
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // 법인명 조회 모달 Mock 핸들러
  const handleLookupSearch = () => {
    // 실제 서비스에서는 팝업/바텀시트 조회 결과 주입
    const mockCompany = '원티드랩 파이낸셜 주식회사';
    setCompanyName(mockCompany);
    setTouched((prev) => ({ ...prev, companyName: true }));
  };

  // 5. 대출 심사 신청 제출 핸들러 (종합 검증 & 첫 에러 필드 포커스)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 모든 필드를 touched 처리하여 누락된 항목 에러 표출
    setTouched({
      businessNo: true,
      companyName: true,
      loanAmount: true,
      files: true,
    });

    // 1순위: 사업자등록번호 검증
    if (!isValidBusinessNo(businessNo.raw)) {
      businessNoRef.current?.focus();
      return;
    }

    // 2순위: 법인 상호명 검증
    if (!companyName.trim()) {
      companyNameRef.current?.focus();
      return;
    }

    // 3순위: 대출 금액 검증 (최대 10억)
    if (loanAmount <= 0 || loanAmount > 1_000_000_000) {
      loanAmountRef.current?.focus();
      return;
    }

    // 4순위: 서류 등록 검증
    if (files.length === 0) {
      alert('필수 증빙 서류를 1건 이상 첨부해 주세요.');
      return;
    }

    alert('대출 심사 신청이 성공적으로 접수되었습니다.');
  };

  return (
    <div className="mobile-container">
      <header className="page-header">
        <h2>기업 운영자금 대출 신청</h2>
        <p>사업자 정보와 희망 여신 조건을 입력해 주세요.</p>
      </header>

      <form className="form-body" onSubmit={handleSubmit} noValidate>
        {/* 1. 사업자 번호 (MaskedInput + validators 연동) */}
        <Field
          label="사업자등록번호"
          required
          helperText="하이픈(-) 없이 숫자만 입력하세요"
          error={isBusinessNoError ? '유효하지 않은 사업자등록번호입니다. (10자리)' : undefined}
        >
          <MaskedInput
            ref={businessNoRef}
            maskType="business-no"
            placeholder="000-00-00000"
            inputSize="md"
            value={businessNo.formatted}
            isError={isBusinessNoError}
            onBlur={() => setTouched((prev) => ({ ...prev, businessNo: true }))}
            onValueChange={(formatted, raw) => setBusinessNo({ formatted, raw })}
          />
        </Field>

        {/* 2. 법인/기업명 검색 (LookupInput + 필수 입력 검증) */}
        <Field
          label="법인 상호명"
          required
          helperText="우측 검색 버튼을 눌러 법인 정보를 조회하세요"
          error={isCompanyNameError ? '법인 상호명을 조회 및 선택해 주세요.' : undefined}
        >
          <LookupInput
            ref={companyNameRef}
            value={companyName}
            readOnly
            placeholder="상호명을 검색하세요"
            isError={isCompanyNameError}
            onBlur={() => setTouched((prev) => ({ ...prev, companyName: true }))}
            onSearchClick={handleLookupSearch}
          />
        </Field>

        {/* 3. 대출 신청 금액 (CurrencyInput + Warn 및 초과 에러 검증) */}
        <Field
          label="희망 대출금액"
          required
          helperText="최대 신청 한도는 10억 원입니다."
          warn={isLoanAmountWarn ? '5억 이상 신청 건은 본점 특별 심사 대상입니다.' : undefined}
          error={
            isLoanAmountError
              ? loanAmount > 1_000_000_000
                ? '최대 대출 신청 한도(10억 원)를 초과했습니다.'
                : '희망 대출금액을 입력해 주세요.'
              : undefined
          }
        >
          <CurrencyInput
            ref={loanAmountRef}
            placeholder="금액을 입력하세요"
            inputSize="md"
            status={isLoanAmountError ? 'error' : isLoanAmountWarn ? 'warn' : 'default'}
            onBlur={() => setTouched((prev) => ({ ...prev, loanAmount: true }))}
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
          <DatePicker
            defaultValue={execDate}
            onChange={(val) => setExecDate(val)}
          />
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

        {/* 8. 증빙 서류 업로드 (FileUpload + 필수 1건 검증) */}
        <Field
          label="필수 증빙 서류"
          required
          helperText="사업자등록증명원, 부가세과세표준증명 (PDF, JPG, 최대 20MB)"
          error={isFilesError ? '필수 증빙 서류를 최소 1건 이상 등록해 주세요.' : undefined}
        >
          <FileUpload
            files={files}
            onUpload={handleUpload}
            onRemove={handleRemoveFile}
            maxSizeMB={20}
          />
        </Field>

        {/* 제출 버튼 */}
        <div className="submit-box">
          <button type="submit" className="btn-submit">
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