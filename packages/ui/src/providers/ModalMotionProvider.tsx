'use client';

import React, { createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalMotionVariants } from '../animations/motionPresets';
import { Dimmed } from '../components/Dimmed/Dimmed';

interface ModalMotionContextType {
    variants: typeof modalMotionVariants;
}

const ModalMotionContext = createContext<ModalMotionContextType>({
    variants: modalMotionVariants,
});

export const useModalMotion = () => useContext(ModalMotionContext);

export const ModalMotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ModalMotionContext.Provider value={{ variants: modalMotionVariants }}>
            {children}
        </ModalMotionContext.Provider>
    );
};

interface MotionLayerProps {
    isOpen: boolean;
    type: 'bottomSheet' | 'fullPopup' | 'dialog';
    onClose?: () => void;
    children: React.ReactNode;
    closeOnDimmedClick?: boolean;
    showDimmed?: boolean;
}

export function MotionLayer({
    isOpen,
    type,
    onClose,
    children,
    closeOnDimmedClick = true,
    showDimmed = true,
}: MotionLayerProps) {
    // Context에서 variants 주입
    const { variants } = useModalMotion();

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        // dialog일 때는 transform 대신 flex로 중앙 배치하여 모션 충돌 방지
                        ...(type === 'dialog' && {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px',
                        }),
                    }}
                >
                    {/* 독립 Dimmed */}
                    {showDimmed && (
                        <Dimmed
                            zIndex={1}
                            onClick={closeOnDimmedClick ? onClose : undefined}
                        />
                    )}

                    {/* 타겟 모달 애니메이션 컨테이너 */}
                    <motion.div
                        variants={variants[type]}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()} // 본문 클릭 시 닫힘 방지
                        style={{
                            position: type === 'dialog' ? 'relative' : 'absolute',
                            zIndex: 2,
                            ...(type === 'bottomSheet' && { bottom: 0, left: 0, right: 0 }),
                            ...(type === 'fullPopup' && { inset: 0 }),
                            ...(type === 'dialog' && { width: '100%', maxWidth: '360px' }),
                        }}
                    >
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}