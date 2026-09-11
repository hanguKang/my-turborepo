'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BottomSheet,
  Dialog,
  type StepItem,
  LottieAnimation,
  SUCCESS_LOTTIE_DATA, // <-- @repo/ui에서 깔끔하게 가져옴
} from '@repo/ui';

export default function PreCheckPage() {
  const router = useRouter();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const [answers, setAnswers] = useState({
    userType: '',
    overdueStatus: '',
    collateralValue: '',
  });

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // 4단계: 토스 스타일 완료 화면
  const SuccessStepContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 0 12px',
        textAlign: 'center',
      }}
    >
      {/* 1회만 재생되는 체크 로티 */}
      <LottieAnimation
        animationData={SUCCESS_LOTTIE_DATA}
        loop={false}
        autoPlay={true}
        width={100}
        height={100}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      >
        <h3
          style={{
            fontSize: '20px',
            fontWeight: 700,
            margin: '18px 0 8px',
            color: '#111827',
            letterSpacing: '-0.3px',
          }}
        >
          대출 신청 적격 대상입니다
        </h3>
        <p
          style={{
            fontSize: '14px',
            color: '#6B7280',
            margin: '0 0 24px',
            lineHeight: 1.5,
            wordBreak: 'keep-all',
          }}
        >
          기본 심사 조건을 모두 충족했습니다.<br />
          간편 한도 조회 후 바로 신청을 이어갈 수 있어요.
        </p>

        {/* 토스형 메인 액션 버튼 */}
        <button
          type="button"
          onClick={() => {
            setIsSheetOpen(false);
            router.push('/loan/apply');
          }}
          style={{
            width: '100%',
            height: '52px',
            backgroundColor: '#1E64FF',
            color: '#FFFFFF',
            border: 0,
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          한도 조회 및 계속하기
        </button>
      </motion.div>
    </div>
  );

  const steps: StepItem[] = [
    {
      title: '1단계: 고객 유형 확인',
      subtitle: '기존 거래 내역에 따라 우대금리가 산정됩니다.',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {['최근 1년 이내 거래 고객', '첫 거래 법인/사업자'].map((label) => (
            <label
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px',
                border: answers.userType === label ? '1.5px solid #1E64FF' : '1px solid #E5E7EB',
                backgroundColor: answers.userType === label ? '#F0F5FF' : '#FFFFFF',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              <input
                type="radio"
                name="userType"
                checked={answers.userType === label}
                onChange={() => setAnswers((prev) => ({ ...prev, userType: label }))}
              />
              <span style={{ fontSize: '14px', fontWeight: answers.userType === label ? 600 : 400 }}>
                {label}
              </span>
            </label>
          ))}
        </div>
      ),
    },
    {
      title: '2단계: 신용관리 정보 확인',
      subtitle: '현재 국세/지방세 체납 또는 대출 연체 유무를 체크합니다.',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { id: 'CLEAR', text: '체납 및 연체 이력 전혀 없음' },
            { id: 'OVERDUE', text: '현재 30일 이상 대출 연체 또는 세금 체납 중' },
          ].map((item) => (
            <label
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px',
                border: answers.overdueStatus === item.id ? '1.5px solid #1E64FF' : '1px solid #E5E7EB',
                backgroundColor: answers.overdueStatus === item.id ? '#F0F5FF' : '#FFFFFF',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              <input
                type="radio"
                name="overdueStatus"
                checked={answers.overdueStatus === item.id}
                onChange={() => setAnswers((prev) => ({ ...prev, overdueStatus: item.id }))}
              />
              <span style={{ fontSize: '14px', fontWeight: answers.overdueStatus === item.id ? 600 : 400 }}>
                {item.text}
              </span>
            </label>
          ))}
        </div>
      ),
    },
    {
      title: '3단계: 예상 담보 비율 산정',
      subtitle: '제공 예정인 담보물의 공시지가 기준을 선택해 주세요.',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {['대출 희망액의 140% 이상 충족', '담보 가치 140% 미만 (한도 축소 대상)'].map((val) => (
            <label
              key={val}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px',
                border: answers.collateralValue === val ? '1.5px solid #1E64FF' : '1px solid #E5E7EB',
                backgroundColor: answers.collateralValue === val ? '#F0F5FF' : '#FFFFFF',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              <input
                type="radio"
                name="collateralValue"
                checked={answers.collateralValue === val}
                onChange={() => setAnswers((prev) => ({ ...prev, collateralValue: val }))}
              />
              <span style={{ fontSize: '14px', fontWeight: answers.collateralValue === val ? 600 : 400 }}>
                {val}
              </span>
            </label>
          ))}
        </div>
      ),
    },
    // 4단계: 토스형 완료 화면
    {
      title: '',
      subtitle: '',
      content: SuccessStepContent,
    },
  ];

  const isStepValid = () => {
    if (step === 0) return Boolean(answers.userType);
    if (step === 1) return Boolean(answers.overdueStatus);
    if (step === 2) return Boolean(answers.collateralValue);
    return true;
  };

  const handleNext = () => {
    if (step === 1 && answers.overdueStatus === 'OVERDUE') {
      setIsSheetOpen(false);
      setIsAlertOpen(true);
      return;
    }

    setDirection(1);
    // 3단계 완료 시 alert 대신 4단계(완료 화면)로 슬라이드 이동
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', padding: '32px 20px' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 6px' }}>대출 한도 사전 적격 심사</h1>
      <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 24px' }}>
        간편 설문을 통해 예상 한도와 대출 가능 여부를 진단합니다.
      </p>

      <button
        type="button"
        onClick={() => {
          setDirection(1);
          setStep(0);
          setIsSheetOpen(true);
        }}
        style={{
          width: '100%',
          height: '52px',
          backgroundColor: '#1E64FF',
          color: '#fff',
          border: 0,
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        사전 적격 진단 시작 (바텀시트)
      </button>

      {/* 모션 적용 바텀시트 */}
      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        currentStep={step}
        direction={direction}
        steps={steps}
        onNext={handleNext}
        onPrev={handlePrev}
        onComplete={() => {
          setIsSheetOpen(false);
          router.push('/loan/apply');
        }}
        isNextDisabled={!isStepValid()}
      />

      {/* 부적격 알림 모달 */}
      <Dialog
        isOpen={isAlertOpen}
        type="danger"
        title="대출 신청 부적격 안내"
        description="현재 연체 정보가 등록된 사업자는 금융기관 공동 협약에 의해 신규 대출 진행이 즉시 제한됩니다."
        confirmText="확인 완료"
        onConfirm={() => setIsAlertOpen(false)}
      />
    </div>
  );
}