import type { Variants, Transition } from 'framer-motion';

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 38,
  mass: 0.8,
};

// 딤 전용 페이드 프리셋 분리
export const backdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } },
};

export const modalMotionVariants: Record<string, Variants> = {
  bottomSheet: {
    initial: { y: '30%', opacity: 0 },
    animate: { y: 0, opacity: 1, transition: springTransition },
    exit: { y: '25%', opacity: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  },
  fullPopup: {
    initial: { y: 60, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: springTransition },
    exit: { y: 40, opacity: 0, transition: { duration: 0.18, ease: 'easeOut' } },
  },
  dialog: {
    initial: { scale: 0.94, opacity: 0, y: 10 },
    animate: { scale: 1, opacity: 1, y: 0, transition: springTransition },
    exit: { scale: 0.96, opacity: 0, transition: { duration: 0.15 } },
  },
};