'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Field,
  Input,
  MaskedInput,
  CurrencyInput,
  Select,
  Switch,
  TermsAgreement, 
  GuarantorSection,
} from '@repo/ui';

import {
  corporateSignupSchema, 
  type CorporateSignupForm,
  REPAY_TYPES,
} from '@/product_test/features/auth/schema'

const BENEFIT_OPTIONS = [
  { value: 'INTEREST_CUT', label: '금리 우대 (최대 0.5%p)' },
  { value: 'LATE_FEE_WAIVER', label: '연체 수수료 1회 감면' },
  { value: 'FREE_INSURANCE', label: '무료 사업자 안심보험 가입' },
] as const;

export default function CorporateSignupPage() {
const {
  register,
  handleSubmit,
  control,
  watch,
  formState: { errors, isSubmitting },
} = useForm({
  resolver: zodResolver(corporateSignupSchema),
  mode: 'onBlur',
  defaultValues: {
    companyName: '',
    businessNo: '',
    phone: '',
    loanAmount: 0,
    collateral: 0,
    repayType: 'BULLET' as const,
    isEarlyRepayExempt: false,
    isTermsAgreed: false,
    preferredBenefits: [],
    guarantorCode: undefined,
  },
});
  const loanAmount = watch('loanAmount');
  const collateral = watch('collateral');

  const onSubmit = (data: CorporateSignupForm) => {
    console.log('✅ Zod 검증 완료 데이터:', data);
    alert(`신청 완료!\n상호명: ${data.companyName}\n대출희망액: ${data.loanAmount.toLocaleString()}원`);
  };

  return (
    <div style={{ maxWidth: '460px', margin: '0 auto', padding: '32px 20px', minHeight: '100vh', backgroundColor: '#fff' }}>
      <header style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 6px 0', color: '#111827' }}>
          법인·사업자 대출 한도 조회
        </h1>
        <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
          정확한 심사를 위해 사업자 정보를 입력해 주세요.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        
        {/* [1] 상호명 */}
        <Field label="상호명" required error={errors.companyName?.message}>
          <Input
            placeholder="사업자등록증 상호명"
            status={errors.companyName ? 'error' : 'default'}
            {...register('companyName')}
          />
        </Field>

        {/* [2] 사업자등록번호 (MaskedInput) */}
        <Field label="사업자등록번호" required error={errors.businessNo?.message}>
          <Controller
            name="businessNo"
            control={control}
            render={({ field }) => (
              <MaskedInput
                ref={field.ref}
                maskType="business-no"
                value={field.value}
                onValueChange={(val) => field.onChange(val)}
                placeholder="000-00-00000"
                status={errors.businessNo ? 'error' : 'default'}
              />
            )}
          />
        </Field>

        {/* [3] 대표자 휴대폰번호 (MaskedInput) */}
        <Field label="대표자 휴대폰번호" required error={errors.phone?.message}>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <MaskedInput
                ref={field.ref}
                maskType="phone"
                value={field.value}
                onValueChange={(val) => field.onChange(val)}
                placeholder="010-0000-0000"
                status={errors.phone ? 'error' : 'default'}
              />
            )}
          />
        </Field>

        {/* [4] 대출 희망금액 (교차 검증 에러 귀속 지점) */}
        <Field
          label="대출 희망금액"
          required
          error={errors.loanAmount?.message}
          helperText={collateral > 0 ? `현재 담보 평가액 대비 약 ${Math.round((collateral / (loanAmount || 1)) * 100)}%` : undefined}
        >
          <Controller
            name="loanAmount"
            control={control}
            render={({ field }) => (
              <CurrencyInput
                ref={field.ref}
                value={field.value}
                onValueChange={(num) => field.onChange(num)}
                placeholder="0"
                status={errors.loanAmount ? 'error' : 'default'}
              />
            )}
          />
        </Field>

        {/* [5] 담보 가치 평가액 */}
        <Field
          label="제공 담보 가치"
          required
          error={errors.collateral?.message}
          helperText="부동산/공장 등 공시 감정평가액 (대출금액의 140% 초과 필수)"
        >
          <Controller
            name="collateral"
            control={control}
            render={({ field }) => (
              <CurrencyInput
                ref={field.ref}
                value={field.value}
                onValueChange={(num) => field.onChange(num)}
                placeholder="0"
                status={errors.collateral ? 'error' : 'default'}
              />
            )}
          />
        </Field>

        {/* [6] 상환 방식 선택 */}
        <Field label="상환 방식" required error={errors.repayType?.message}>
          <Select
            options={REPAY_TYPES.map((type) => ({
              value: type,
              label:
                type === 'BULLET'
                  ? '만기일시상환'
                  : type === 'EQUAL_PRINCIPAL'
                  ? '원금균등분할상환'
                  : '원리금균등분할상환',
            }))}
            {...register('repayType')}
          />
        </Field>

        {/* [7] 중도상환수수료 면제 스위치 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>중도상환수수료 면제 대상</div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>소상공인·우대조건 대상자 여부</div>
          </div>
          <Controller
            name="isEarlyRepayExempt"
            control={control}
            render={({ field }) => (
              <Switch
                checked={!!field.value}
                onChange={(checked) => field.onChange(checked)}
              />
            )}
          />
        </div>

        {/* [8] 희망 우대 혜택 다중 체크박스 (배열 바인딩) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
            희망 우대 혜택 (선택)
          </label>
          <Controller
            name="preferredBenefits"
            control={control}
            render={({ field }) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {BENEFIT_OPTIONS.map((item) => {
                  const isChecked = (field.value || []).includes(item.value);
                  return (
                    <label
                      key={item.value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                        color: '#374151',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const current = field.value || [];
                          if (e.target.checked) {
                            field.onChange([...current, item.value]);
                          } else {
                            field.onChange(current.filter((val) => val !== item.value));
                          }
                        }}
                        style={{ accentColor: '#1E64FF' }}
                      />
                      {item.label}
                    </label>
                  );
                })}
              </div>
            )}
          />
        </div>

        {/* [9] 보증인 입력 섹션 (SEC_ 정규식 검증) */}
        <Controller
          name="guarantorCode"
          control={control}
          render={({ field }) => (
            <GuarantorSection
              value={field.value}
              onChange={field.onChange}
              error={errors.guarantorCode?.message}
            />
          )}
        />

        {/* [10] 약관 동의 (필수 boolean refine) */}
        <Controller
          name="isTermsAgreed"
          control={control}
          render={({ field }) => (
            <TermsAgreement
              isAgreed={field.value}
              onChange={field.onChange}
              error={errors.isTermsAgreed?.message}
            />
          )}
        />

        {/* 심사 신청 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            marginTop: '12px',
            width: '100%',
            height: '52px',
            backgroundColor: '#1E64FF',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.6 : 1,
          }}
        >
          {isSubmitting ? '심사 기준 검증 중...' : '대출 한도 조회하기'}
        </button>
      </form>
    </div>
  );
}