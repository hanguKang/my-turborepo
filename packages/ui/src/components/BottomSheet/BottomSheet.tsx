'use client';

import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { MotionLayer } from '../../providers/ModalMotionProvider';

export interface StepItem {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  direction: number; // 1: 다음, -1: 이전
  steps: StepItem[];
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
  isNextDisabled?: boolean;
}

// 내부 스텝 수평 슬라이더 애니메이션
const stepVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '60%' : '-60%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: 'spring', stiffness: 350, damping: 32 },
      opacity: { duration: 0.18 },
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-60%' : '60%',
    opacity: 0,
    transition: {
      x: { type: 'spring', stiffness: 350, damping: 32 },
      opacity: { duration: 0.18 },
    },
  }),
};

export function BottomSheet({
  isOpen,
  onClose,
  currentStep,
  direction,
  steps,
  onNext,
  onPrev,
  onComplete,
  isNextDisabled = false,
}: BottomSheetProps) {
  const isLast = currentStep === steps.length - 1;

  return (
    <MotionLayer isOpen={isOpen} type="bottomSheet" onClose={onClose}>
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* 상단 드래그 핸들 바 */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 6px' }}>
          <div
            style={{
              width: '36px',
              height: '4px',
              backgroundColor: '#E5E7EB',
              borderRadius: '2px',
            }}
          />
        </div>

        {/* 수평 스텝 슬라이드 전환 영역 */}
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: '260px', padding: '12px 24px 0' }}>
          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              style={{ width: '100%' }}
            >
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px', color: '#191F28' }}>
                {steps[currentStep]?.title}
              </h2>
              {steps[currentStep]?.subtitle && (
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 20px' }}>
                  {steps[currentStep]?.subtitle}
                </p>
              )}
              {steps[currentStep]?.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 하단 네비게이션 버튼 */}
        <div style={{ display: 'flex', gap: '8px', padding: '20px 24px 28px' }}>
          {currentStep > 0 && (
            <button
              type="button"
              onClick={onPrev}
              style={{
                flex: 1,
                height: '52px',
                border: 0,
                borderRadius: '12px',
                backgroundColor: '#F2F4F6',
                color: '#4E5968',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              이전
            </button>
          )}
          <button
            type="button"
            disabled={isNextDisabled}
            onClick={isLast ? onComplete : onNext}
            style={{
              flex: 2,
              height: '52px',
              border: 0,
              borderRadius: '12px',
              backgroundColor: isNextDisabled ? '#E5E7EB' : '#1E64FF',
              color: isNextDisabled ? '#9CA3AF' : '#FFFFFF',
              fontSize: '15px',
              fontWeight: 600,
              cursor: isNextDisabled ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            {isLast ? '심사 완료' : '다음'}
          </button>
        </div>
      </div>
    </MotionLayer>
  );
}