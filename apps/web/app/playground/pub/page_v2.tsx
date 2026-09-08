'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Field,
  Input,
  MaskedInput,
  CurrencyInput,
  Select,
  Switch,
  FileUpload,
} from '@repo/ui';

// 1. 전체 폼의 데이터 모델 정의
export interface LoanApplicationFormValues {
  companyName: string;            // 상호명 (일반 텍스트)
  businessNo: string;             // 사업자등록번호 (10자리 마스킹)
  loanAmount: number;             // 대출 희망금액 (숫자)
  repayType: string;              // 상환 방식 (Select 선택)
  isEarlyRepayExempt: boolean;    // 중도상환수수료 면제 대상 여부 (Switch)
  files: File[];                  // 첨부 서류 (파일 배열)
}

export default function MobileLoanApplyPage() {
  // 2. useForm 선언 및 기본값 설정
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoanApplicationFormValues>({
    mode: 'onBlur', // 포커스가 빠져나갈 때 유효성 검사 수행 (타이핑 시 불필요 렌더링 방지)
    defaultValues: {
      companyName: '',
      businessNo: '',
      loanAmount: 0,
      repayType: 'BULLET',
      isEarlyRepayExempt: false,
      files: [],
    },
  });

  // 대출금액 실시간 감시 (warn 경고 문구 조건부 노출용)
  const currentLoanAmount = watch('loanAmount');

  // 3. 최종 제출 핸들러 (유효성 검증 모두 통과 시 실행)
  const onSubmit = (data: LoanApplicationFormValues) => {
    console.log('✅ 서버로 전송될 최종 정제 데이터:', data);
    alert(
      `대출 신청 완료!\n사업체: ${data.companyName}\n사업자번호: ${data.businessNo}\n신청금액: ${data.loanAmount.toLocaleString()}원`
    );
  };

  return (
    <main style={{ maxWidth: '440px', margin: '0 auto', padding: '24px 20px', minHeight: '100vh', backgroundColor: '#fff' }}>
      <header style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 8px 0', color: '#111' }}>
          사업자 대출 간편 신청
        </h1>
        <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
          모바일 전용 간편 심사 프로세스입니다.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
       
        {/* [1] 사업체명 - 일반 register 패턴 */}
        <Field
          label="사업체명"
          required
          error={errors.companyName?.message}
        >
          <Input
            placeholder="예: 주식회사 원티드랩"
            status={errors.companyName ? 'error' : 'default'}
            {...register('companyName', {
              required: '사업체명을 입력해주세요.',
            })}
          />
        </Field>

        {/* [2] 사업자등록번호 - Controller + MaskedInput */}
        <Field
          label="사업자등록번호"
          required
          error={errors.businessNo?.message}
          helperText="사업자등록증 상의 10자리 번호를 입력하세요."
        >
          <Controller
            name="businessNo"
            control={control}
            rules={{
              required: '사업자등록번호는 필수입니다.',
              validate: (val)=>val.length === 10 || '10자리 사업자번호를 입력해 주세요',
              pattern: {
                value: /^\d{3}-\d{2}-\d{5}$/,
                message: '10자리 사업자번호 형식에 맞게 입력해주세요.',
              },
            }}
            render={({ field }) => (
              <MaskedInput
                maskType='business-no'
                ref={field.ref}
                name={field.name}
                value={field.value}
                onBlur={field.onBlur}
                onValueChange={ (val)=> field.onChange(val)}                
                placeholder="000-00-00000"
                status={errors.businessNo ? 'error' : 'default'}
              />
            )}
          />
        </Field>

        {/* [3] 대출 희망금액 - Controller + CurrencyInput */}
        <Field
          label="대출 희망금액"
          required
          error={errors.loanAmount?.message}
          warn={currentLoanAmount >= 500_000_000 ? '5억 원 초과 신청 건은 본점 심사 승인 대상입니다.' : undefined}
        >
          <Controller
            name="loanAmount"
            control={control}
            rules={{
              required: '희망 대출금액을 입력해주세요.',
              validate: (val) => val >= 1_000_000 || '최소 100만 원 이상 신청 가능합니다.',
            }}
            render={({ field }) => (
              <CurrencyInput
                ref={field.ref}
                name={field.name}
                value={field.value}
                onBlur={field.onBlur}
                onChange={field.onChange}
                placeholder="0"
                status={errors.loanAmount ? 'error' : 'default'}
              />
            )}
          />
        </Field>

        {/* [4] 상환 방식 - register + Select */}
        <Field label="상환 방식" required error={errors.repayType?.message}>
          <Select
            options={[
              { label: '만기일시상환 (추천)', value: 'BULLET' },
              { label: '원리금균등분할상환', value: 'EQUAL_PI' },
              { label: '원금균등분할상환', value: 'EQUAL_P' },
            ]}
            {...register('repayType', {
              required: '상환 방식을 선택해주세요.',
            })}
          />
        </Field>

        {/* [5] 중도상환수수료 감면 대상 여부 - Controller + Switch */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>
              중도상환수수료 감면 대상
            </div>
            <div style={{ fontSize: '12px', color: '#888' }}>
              청년창업 및 소상공인 우대 조건에 해당 시 체크
            </div>
          </div>
          <Controller
            name="isEarlyRepayExempt"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onChange={(checked) => field.onChange(checked)}
              />
            )}
          />
        </div>

        {/* [6] 사업자등록증 첨부 - Controller + FileUpload */}
        <Field
          label="서류 첨부 (사업자등록증)"
          helperText="JPG, PNG, PDF 파일 (최대 10MB)"
          error={errors.files?.message}
        >
          <Controller
            name="files"
            control={control}
            rules={{
              validate: (files) => files.length > 0 || '필수 확인을 위해 사업자등록증 사본을 첨부해주세요.',
            }}
            render={({ field }) => (
              <FileUpload
                files={field.value}
                onChange={(updatedFiles) => field.onChange(updatedFiles)}
                maxFiles={3}
                accept="image/*,.pdf"
              />
            )}
          />
        </Field>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            marginTop: '20px',
            width: '100%',
            height: '52px',
            backgroundColor: '#1E64FF',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.6 : 1,
            transition: 'background-color 0.2s',
          }}
        >
          {isSubmitting ? '심사 서류 확인 중...' : '대출 심사 신청서 제출'}
        </button>
      </form>
    </main>
  );
}