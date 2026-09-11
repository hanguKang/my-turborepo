'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { backdropVariants } from '../../animations/motionPresets';

export interface DimmedProps extends HTMLMotionProps<'div'> {
  /** 딤 클릭 시 닫기 핸들러 */
  onClick?: () => void;
  /** 배경 블러 효과 적용 여부 (기본: false) */
  blur?: boolean;
  /** z-index 직접 지정 (기본: 1) */
  zIndex?: number;
  /** 투명도 색상 커스텀 (기본: rgba(0, 0, 0, 0.5)) */
  backgroundColor?: string;
}

export const Dimmed = React.forwardRef<HTMLDivElement, DimmedProps>(
  (
    {
      onClick,
      blur = false,
      zIndex = 1,
      backgroundColor = 'rgba(0, 0, 0, 0.5)',
      style,
      ...rest
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        variants={backdropVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        onClick={onClick}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor,
          backdropFilter: blur ? 'blur(4px)' : 'none',
          WebkitBackdropFilter: blur ? 'blur(4px)' : 'none',
          zIndex,
          ...style,
        }}
        {...rest}
      />
    );
  }
);

Dimmed.displayName = 'Dimmed';