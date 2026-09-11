// packages/ui/src/components/Lottie/LottieAnimation.tsx
'use client';

import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { Lottie, type LottieHandle } from 'lottie-react';

export interface LottieAnimationHandle {
    play: () => void;
    stop: () => void;
    pause: () => void;
}

export interface LottieAnimationProps {
    /** v3 표준 prop: JSON 객체, URL 문자열, 또는 public 경로 */
    src?: Record<string, any> | string;
    /** v2 호환용 prop (src가 없을 경우 대비) */
    animationData?: Record<string, any>;
    loop?: boolean;
    autoPlay?: boolean;
    autoplay?: boolean;
    width?: number | string;
    height?: number | string;
    onComplete?: () => void;
    className?: string;
    style?: React.CSSProperties;
}

export const LottieAnimation = forwardRef<LottieAnimationHandle, LottieAnimationProps>(
    (
        {
            src,
            animationData,
            loop = false,
            autoPlay = true,
            autoplay = true,
            width = 120,
            height = 120,
            onComplete,
            className,
            style,
        },
        ref
    ) => {
        const lottieRef = useRef<LottieHandle>(null);

        // v3 src 우선, 없으면 animationData 사용
        const animationSource = src || animationData;
        const shouldAutoplay = autoPlay ?? autoplay;

        useImperativeHandle(ref, () => ({
            play: () => lottieRef.current?.play(),
            stop: () => lottieRef.current?.stop(),
            pause: () => lottieRef.current?.pause(),
        }));

        if (!animationSource) {
            return null;
        }

        return (
            <div
                className={className}
                style={{
                    width,
                    height,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    ...style,
                }}
            >
                <Lottie
                    lottieRef={lottieRef}
                    src={animationSource}
                    loop={loop}
                    autoplay={shouldAutoplay}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
        );
    }
);

LottieAnimation.displayName = 'LottieAnimation';